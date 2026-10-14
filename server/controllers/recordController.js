const LandRecord = require('../models/LandRecord');
const Village = require('../models/Village');
const CaptchaService = require('../services/captchaService');
const { getIsConnected } = require('../config/db');
const { inMemoryData } = require('../seeds/seedData');

const normCode = (code) => String(code || '').replace(/^0+(?=\d)/, '');

const hasValidLocation = async (districtCode, mandalCode, villageCode) => {
  const normDist = normCode(districtCode);
  const normMand = normCode(mandalCode);
  const normVill = normCode(villageCode);

  const check = (v) =>
    normCode(v.districtCode) === normDist &&
    normCode(v.mandalCode) === normMand &&
    normCode(v.code) === normVill;

  if (inMemoryData.villages.some(check)) return true;

  if (!getIsConnected()) return false;

  const villageExists = await Village.exists({
    $or: [
      { districtCode, mandalCode, code: villageCode, isActive: true },
      { districtCode: normDist, mandalCode: normMand, code: normVill, isActive: true }
    ]
  });
  return Boolean(villageExists);
};

const withoutAadhaarLastFour = (record) => {
  const { aadhaarLast4, ...safeRecord } = record;
  return safeRecord;
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const matchesCriteria = (record, { qKhata, qSurvey, qSubDiv, qPattadar, qAadhaar }) => {
  if (qKhata && record.khataNo !== qKhata) {
    return false;
  }

  if (qSurvey && record.surveyNo !== qSurvey) {
    return false;
  }

  if (qSubDiv) {
    const rSub = (record.subDivisionNo || '').toLowerCase();
    const qSub = qSubDiv.toLowerCase();
    const matchSub = rSub === qSub || rSub.endsWith('/' + qSub) || qSub.endsWith('/' + rSub);
    if (!matchSub) return false;
  }

  if (qPattadar) {
    const q = qPattadar.toLowerCase().trim();
    const pEn = (record.pattadarNameEn || '').toLowerCase();
    const pTe = (record.pattadarNameTe || '');
    const dFa = (record.displayFatherName || '').toLowerCase();
    const aliases = (record.aliases || []).map(a => a.toLowerCase());

    const matchesName =
      pEn === q ||
      pEn.includes(q) ||
      pTe.includes(qPattadar.trim()) ||
      dFa.includes(q) ||
      aliases.some(a => a === q || a.includes(q));

    if (!matchesName) return false;
  }

  if (qAadhaar) {
    if (!record.aadhaarSeeded || record.aadhaarLast4 !== qAadhaar.slice(-4)) {
      return false;
    }
  }

  return true;
};

const findDemoRecords = (districtCode, mandalCode, villageCode) => {
  const normDist = normCode(districtCode);
  const normMand = normCode(mandalCode);
  const normVill = normCode(villageCode);

  return inMemoryData.records.filter(record =>
    normCode(record.districtCode) === normDist &&
    normCode(record.mandalCode) === normMand &&
    normCode(record.villageCode) === normVill
  );
};

// POST /api/records/search
exports.searchRecords = async (req, res, next) => {
  try {
    const { 
      districtCode, 
      mandalCode, 
      villageCode, 
      searchType, 
      searchValue,
      khataNo,
      surveyNo,
      subDivisionNo,
      pattadarName,
      aadhaar,
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

    // Extract search terms from specific fields or searchType/searchValue
    const rawVal = searchValue ? String(searchValue).trim() : '';
    const qKhata = String(khataNo || (searchType === 'khataNo' ? rawVal : '') || '').trim();
    let qSurvey = String(surveyNo || (searchType === 'surveyNo' ? rawVal : '') || '').trim();
    let qSubDiv = String(subDivisionNo || '').trim();
    const qPattadar = String(pattadarName || (searchType === 'pattadarName' ? rawVal : '') || '').trim();
    const qAadhaar = String(aadhaar || (searchType === 'aadhaar' ? rawVal : '') || '').trim();

    if (qAadhaar && !/^\d{4}$/.test(qAadhaar)) {
      return res.status(400).json({
        success: false,
        message: 'Aadhaar lookup accepts only the last 4 digits. Do not submit a full Aadhaar number.'
      });
    }

    if (!qKhata && !qSurvey && !qSubDiv && !qPattadar && !qAadhaar) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search value cannot be blank.' 
      });
    }

    if (!(await hasValidLocation(districtCode, mandalCode, villageCode))) {
      return res.status(400).json({
        success: false,
        message: 'The selected village does not belong to the selected mandal and district.'
      });
    }

    const criteria = { qKhata, qSurvey, qSubDiv, qPattadar, qAadhaar };
    let records = [];

    if (!getIsConnected()) {
      records = findDemoRecords(districtCode, mandalCode, villageCode)
        .filter(record => matchesCriteria(record, criteria));
    } else {
      const normDist = normCode(districtCode);
      const normMand = normCode(mandalCode);
      const normVill = normCode(villageCode);

      const filter = {
        $and: [
          {
            $or: [
              { districtCode, mandalCode, villageCode },
              { districtCode: normDist, mandalCode: normMand, villageCode: normVill }
            ]
          }
        ]
      };

      if (qKhata) {
        filter.$and.push({ khataNo: qKhata });
      }

      if (qSurvey) {
        filter.$and.push({ surveyNo: qSurvey });
      }

      if (qSubDiv) {
        const escapedSub = escapeRegExp(qSubDiv);
        filter.$and.push({
          $or: [
            { subDivisionNo: { $regex: `^${escapedSub}$`, $options: 'i' } },
            { subDivisionNo: { $regex: `/${escapedSub}$`, $options: 'i' } }
          ]
        });
      }

      if (qPattadar) {
        const escapedName = escapeRegExp(qPattadar);
        filter.$and.push({
          $or: [
            { pattadarNameEn: { $regex: escapedName, $options: 'i' } },
            { pattadarNameTe: { $regex: escapedName } },
            { displayFatherName: { $regex: escapedName, $options: 'i' } },
            { aliases: { $in: [new RegExp(escapedName, 'i')] } }
          ]
        });
      }

      if (qAadhaar) {
        filter.$and.push({
          aadhaarSeeded: true,
          aadhaarLast4: qAadhaar.slice(-4)
        });
      }

      records = await LandRecord.find(filter).lean();
      if (records.length === 0) {
        records = findDemoRecords(districtCode, mandalCode, villageCode)
          .filter(record => matchesCriteria(record, criteria));
      }
    }

    return res.json({
      success: true,
      count: records.length,
      data: records.map(withoutAadhaarLastFour),
      disclaimer: 'DEMO DATA — NOT AN OFFICIAL GOVERNMENT LAND RECORD',
      message: records.length === 0 ? 'No matching demo records found' : undefined
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
      if (records.length === 0) {
        records = findDemoRecords(districtCode, mandalCode, villageCode);
      }
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
      if (records.length === 0) {
        records = findDemoRecords(districtCode, mandalCode, villageCode);
      }
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
