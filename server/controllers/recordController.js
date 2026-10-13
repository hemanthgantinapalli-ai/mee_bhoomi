const LandRecord = require('../models/LandRecord');
const Village = require('../models/Village');
const CaptchaService = require('../services/captchaService');
const { getIsConnected } = require('../config/db');
const { inMemoryData } = require('../seeds/seedData');

const hasValidLocation = async (districtCode, mandalCode, villageCode) => {
  if (!getIsConnected()) {
    return inMemoryData.villages.some(village =>
      village.districtCode === districtCode &&
      village.mandalCode === mandalCode &&
      village.code === villageCode
    );
  }

  return Boolean(await Village.exists({
    districtCode,
    mandalCode,
    code: villageCode,
    isActive: true
  }));
};

const withoutAadhaarLastFour = (record) => {
  const { aadhaarLast4, ...safeRecord } = record;
  return safeRecord;
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// POST /api/records/search
exports.searchRecords = async (req, res, next) => {
  try {
    const { 
      districtCode, 
      mandalCode, 
      villageCode, 
      searchType = 'surveyNo', 
      searchValue,
      captchaToken,
      captchaAnswer
    } = req.body;

    // Server-side Captcha Verification
    if (!captchaToken || !captchaAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Captcha code is required to search land records.'
      });
    }

    const captchaRes = CaptchaService.verifyChallenge(captchaToken, captchaAnswer);
    if (!captchaRes.success) {
      return res.status(400).json({
        success: false,
        message: captchaRes.message || 'Invalid or expired captcha.'
      });
    }

    if (!districtCode || !mandalCode || !villageCode) {
      return res.status(400).json({ 
        success: false, 
        message: 'District, Mandal, and Village selections are mandatory.' 
      });
    }

    if (!searchValue || String(searchValue).trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Search value cannot be blank.' 
      });
    }

    const val = String(searchValue).trim();

    if (!['surveyNo', 'khataNo', 'aadhaar', 'pattadarName'].includes(searchType)) {
      return res.status(400).json({ success: false, message: 'Invalid search type.' });
    }

    if (searchType === 'aadhaar' && !/^\d{4}$/.test(val)) {
      return res.status(400).json({
        success: false,
        message: 'Aadhaar lookup accepts only the last 4 digits. Do not submit a full Aadhaar number.'
      });
    }

    if (!(await hasValidLocation(districtCode, mandalCode, villageCode))) {
      return res.status(400).json({
        success: false,
        message: 'The selected village does not belong to the selected mandal and district.'
      });
    }

    // Query builder
    let records = [];

    if (!getIsConnected()) {
      // In-memory query
      records = inMemoryData.records.filter(r => {
        const matchesLocation = r.districtCode === districtCode && 
                                r.mandalCode === mandalCode && 
                                r.villageCode === villageCode;
        if (!matchesLocation) return false;

        if (searchType === 'surveyNo') {
          return r.surveyNo === val || `${r.surveyNo}/${r.subDivisionNo}` === val;
        } else if (searchType === 'khataNo') {
          return r.khataNo === val;
        } else if (searchType === 'aadhaar') {
          return r.aadhaarSeeded === true && r.aadhaarLast4 === val.slice(-4);
        } else if (searchType === 'pattadarName') {
          return r.pattadarNameEn.toLowerCase().includes(val.toLowerCase()) || 
                 r.pattadarNameTe.includes(val);
        }
        return false;
      });
    } else {
      // MongoDB query
      const filter = { districtCode, mandalCode, villageCode };

      if (searchType === 'surveyNo') {
        if (val.includes('/')) {
          const [sNo, subDiv] = val.split('/');
          filter.surveyNo = sNo;
          filter.subDivisionNo = subDiv;
        } else {
          filter.surveyNo = val;
        }
      } else if (searchType === 'khataNo') {
        filter.khataNo = val;
      } else if (searchType === 'aadhaar') {
        filter.aadhaarSeeded = true;
        filter.aadhaarLast4 = val.slice(-4);
      } else if (searchType === 'pattadarName') {
        const escapedValue = escapeRegExp(val);
        filter.$or = [
          { pattadarNameEn: { $regex: escapedValue, $options: 'i' } },
          { pattadarNameTe: { $regex: escapedValue, $options: 'i' } }
        ];
      }

      records = await LandRecord.find(filter).lean();
    }

    return res.json({
      success: true,
      count: records.length,
      data: records.map(withoutAadhaarLastFour),
      disclaimer: 'Simulated demonstration record for MeeBhoomi recreation. Not an official AP Government legal document.'
    });

  } catch (error) {
    next(error);
  }
};

// GET /api/records/village-adangal
exports.getVillageAdangal = async (req, res, next) => {
  try {
    const { districtCode, mandalCode, villageCode } = req.query;
    if (!districtCode || !mandalCode || !villageCode) {
      return res.status(400).json({ success: false, message: 'District, Mandal, and Village are required.' });
    }

    if (!(await hasValidLocation(districtCode, mandalCode, villageCode))) {
      return res.status(400).json({
        success: false,
        message: 'The selected village does not belong to the selected mandal and district.'
      });
    }

    let records = [];
    if (!getIsConnected()) {
      records = inMemoryData.records.filter(r => 
        r.districtCode === districtCode && r.mandalCode === mandalCode && r.villageCode === villageCode
      );
    } else {
      records = await LandRecord.find({ districtCode, mandalCode, villageCode }).lean();
    }

    res.json({
      success: true,
      count: records.length,
      data: records.map(withoutAadhaarLastFour),
      disclaimer: 'Village Adangal register snapshot.'
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/records/village-1b
exports.getVillage1B = async (req, res, next) => {
  try {
    const { districtCode, mandalCode, villageCode } = req.query;
    if (!districtCode || !mandalCode || !villageCode) {
      return res.status(400).json({ success: false, message: 'District, Mandal, and Village are required.' });
    }

    if (!(await hasValidLocation(districtCode, mandalCode, villageCode))) {
      return res.status(400).json({
        success: false,
        message: 'The selected village does not belong to the selected mandal and district.'
      });
    }

    let records = [];
    if (!getIsConnected()) {
      records = inMemoryData.records.filter(r => 
        r.districtCode === districtCode && r.mandalCode === mandalCode && r.villageCode === villageCode
      );
    } else {
      records = await LandRecord.find({ districtCode, mandalCode, villageCode }).lean();
    }

    res.json({
      success: true,
      count: records.length,
      data: records.map(withoutAadhaarLastFour),
      disclaimer: 'Village 1-B (ROR) register snapshot.'
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/records/:id
exports.getRecordById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let record = null;

    if (!getIsConnected()) {
      record = inMemoryData.records.find(r => r._id === id || r.khataNo === id || r.surveyNo === id);
    } else {
      record = await LandRecord.findById(id).lean();
    }

    if (!record) {
      return res.status(404).json({ success: false, message: 'Land record not found.' });
    }

    res.json({ success: true, data: withoutAadhaarLastFour(record) });
  } catch (error) {
    next(error);
  }
};
