// Input validation helpers
const validateSearchInput = (req, res, next) => {
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
    aadhaar
  } = req.body;

  if (searchType !== undefined && !['surveyNo', 'khataNo', 'aadhaar', 'pattadarName'].includes(searchType)) {
    return res.status(400).json({ success: false, message: 'Invalid search type.' });
  }

  if (!districtCode || typeof districtCode !== 'string' || districtCode.trim() === '') {
    return res.status(400).json({ success: false, message: 'Invalid or missing district code.' });
  }

  if (!mandalCode || typeof mandalCode !== 'string' || mandalCode.trim() === '') {
    return res.status(400).json({ success: false, message: 'Invalid or missing mandal code.' });
  }

  if (!villageCode || typeof villageCode !== 'string' || villageCode.trim() === '') {
    return res.status(400).json({ success: false, message: 'Invalid or missing village code.' });
  }

  const hasSpecificField = [khataNo, surveyNo, subDivisionNo, pattadarName, aadhaar].some(
    val => typeof val === 'string' && val.trim().length > 0
  );
  const hasSearchValue = typeof searchValue === 'string' && searchValue.trim().length > 0;

  if (!hasSpecificField && !hasSearchValue) {
    return res.status(400).json({ success: false, message: 'Search parameter cannot be empty.' });
  }

  const allValues = [searchValue, khataNo, surveyNo, subDivisionNo, pattadarName, aadhaar];
  for (const v of allValues) {
    if (typeof v === 'string' && v.trim().length > 100) {
      return res.status(400).json({ success: false, message: 'Search parameter is too long.' });
    }
  }

  next();
};

module.exports = { validateSearchInput };

