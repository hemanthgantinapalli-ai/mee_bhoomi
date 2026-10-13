// Input validation helpers
const validateSearchInput = (req, res, next) => {
  const {
    districtCode,
    mandalCode,
    villageCode,
    searchType = 'surveyNo',
    searchValue
  } = req.body;

  if (!['surveyNo', 'khataNo', 'aadhaar', 'pattadarName'].includes(searchType)) {
    return res.status(400).json({ success: false, message: 'Invalid search type.' });
  }

  if (!districtCode || typeof districtCode !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid or missing district code.' });
  }

  if (!mandalCode || typeof mandalCode !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid or missing mandal code.' });
  }

  if (!villageCode || typeof villageCode !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid or missing village code.' });
  }

  if (!searchValue || typeof searchValue !== 'string' || searchValue.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Search parameter cannot be empty.' });
  }

  if (searchValue.trim().length > 100) {
    return res.status(400).json({ success: false, message: 'Search parameter is too long.' });
  }

  next();
};

module.exports = { validateSearchInput };
