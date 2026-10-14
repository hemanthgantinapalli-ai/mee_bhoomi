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
    const districts = await District.find({ isActive: true }).sort({ nameEn: 1 }).lean();
    const districtMap = new Map(districts.map(d => [d.code, d]));
    inMemoryData.districts.forEach(d => {
      if (!districtMap.has(d.code)) {
        districtMap.set(d.code, d);
      }
    });
    const combined = [...districtMap.values()].sort((a, b) => a.nameEn.localeCompare(b.nameEn));
    return res.json({ success: true, count: combined.length, data: combined });
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

    const mandals = await Mandal.find({ districtCode, isActive: true }).sort({ nameEn: 1 }).lean();
    const mandalMap = new Map(mandals.map(m => [m.code, m]));
    inMemoryData.mandals
      .filter(m => m.districtCode === districtCode)
      .forEach(m => {
        if (!mandalMap.has(m.code)) {
          mandalMap.set(m.code, m);
        } else if (m.code === '720') {
          // Keep Tulluru name clean
          mandalMap.set(m.code, { ...mandalMap.get(m.code), nameEn: 'Tulluru', nameTe: 'తుళ్లూరు' });
        }
      });
    const combined = [...mandalMap.values()].sort((a, b) => a.nameEn.localeCompare(b.nameEn));
    return res.json({ success: true, count: combined.length, data: combined });
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
    const villages = await Village.find(filter).sort({ nameEn: 1 }).lean();
    const villageOptionsByCode = new Map(villages.map(village => [village.code, village]));
    inMemoryData.villages
      .filter(village =>
        village.mandalCode === mandalCode &&
        (!districtCode || village.districtCode === districtCode) &&
        !villageOptionsByCode.has(village.code)
      )
      .forEach(village => villageOptionsByCode.set(village.code, village));
    const availableVillages = [...villageOptionsByCode.values()]
      .sort((left, right) => left.nameEn.localeCompare(right.nameEn));

    return res.json({ success: true, count: availableVillages.length, data: availableVillages });
  } catch (error) {
    next(error);
  }
};
