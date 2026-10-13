const District = require('../models/District');
const Mandal = require('../models/Mandal');
const Village = require('../models/Village');
const { getIsConnected } = require('../config/db');
const { inMemoryData } = require('../seeds/seedData');

// GET /api/districts
exports.getDistricts = async (req, res, next) => {
  try {
    if (!getIsConnected()) {
      return res.json({ success: true, count: inMemoryData.districts.length, data: inMemoryData.districts });
    }
    const districts = await District.find({ isActive: true }).sort({ nameEn: 1 });
    return res.json({ success: true, count: districts.length, data: districts });
  } catch (error) {
    next(error);
  }
};

// GET /api/mandals?districtCode=...
exports.getMandals = async (req, res, next) => {
  try {
    const { districtCode } = req.query;
    if (!districtCode) {
      return res.status(400).json({ success: false, message: 'districtCode query parameter is required.' });
    }

    if (!getIsConnected()) {
      const mandals = inMemoryData.mandals.filter(m => m.districtCode === districtCode);
      return res.json({ success: true, count: mandals.length, data: mandals });
    }

    const mandals = await Mandal.find({ districtCode, isActive: true }).sort({ nameEn: 1 });
    return res.json({ success: true, count: mandals.length, data: mandals });
  } catch (error) {
    next(error);
  }
};

// GET /api/villages?mandalCode=...
exports.getVillages = async (req, res, next) => {
  try {
    const { districtCode, mandalCode } = req.query;
    if (!mandalCode) {
      return res.status(400).json({ success: false, message: 'mandalCode query parameter is required.' });
    }

    if (!getIsConnected()) {
      const villages = inMemoryData.villages.filter(v =>
        v.mandalCode === mandalCode && (!districtCode || v.districtCode === districtCode)
      );
      return res.json({ success: true, count: villages.length, data: villages });
    }

    const filter = { mandalCode, isActive: true };
    if (districtCode) filter.districtCode = districtCode;
    const villages = await Village.find(filter).sort({ nameEn: 1 });
    return res.json({ success: true, count: villages.length, data: villages });
  } catch (error) {
    next(error);
  }
};
