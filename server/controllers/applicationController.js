const ApplicationStatus = require('../models/ApplicationStatus');
const { getIsConnected } = require('../config/db');
const { inMemoryData } = require('../seeds/seedData');

// GET /api/applications/status/:applicationNo
exports.getApplicationStatus = async (req, res, next) => {
  try {
    const { applicationNo } = req.params;
    if (!applicationNo) {
      return res.status(400).json({ success: false, message: 'Application Number is required.' });
    }

    const appNo = String(applicationNo).trim();
    let app = null;

    if (!getIsConnected()) {
      app = inMemoryData.applications.find(a => a.applicationNo.toUpperCase() === appNo.toUpperCase());
    } else {
      app = await ApplicationStatus.findOne({ applicationNo: { $regex: new RegExp(`^${appNo}$`, 'i') } });
    }

    if (!app) {
      return res.status(404).json({
        success: false,
        message: `No application record found for Application ID: ${appNo}. Please verify the number.`
      });
    }

    res.json({
      success: true,
      data: app
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/applications/status/survey/:surveyNo
exports.getApplicationStatusBySurveyNo = async (req, res, next) => {
  try {
    const surveyNo = String(req.params.surveyNo || '').trim();
    if (!surveyNo) {
      return res.status(400).json({ success: false, message: 'Survey number is required.' });
    }

    const app = getIsConnected()
      ? await ApplicationStatus.findOne({ surveyNo }).sort({ submissionDate: -1 })
      : inMemoryData.applications.find(
          (item) => item.surveyNo.toUpperCase() === surveyNo.toUpperCase()
        );

    if (!app) {
      return res.status(404).json({
        success: false,
        message: `No application record found for survey number: ${surveyNo}.`
      });
    }

    return res.json({ success: true, data: app });
  } catch (error) {
    return next(error);
  }
};

// POST /api/applications/submit
exports.submitApplication = async (req, res, next) => {
  try {
    const { applicantName, serviceType, districtName, mandalName, villageName, surveyNo, khataNo } = req.body;

    if (!applicantName || !serviceType || !districtName || !mandalName || !villageName || !surveyNo) {
      return res.status(400).json({ success: false, message: 'All required application fields must be provided.' });
    }

    const applicationNo = `AP${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;

    const newApp = {
      applicationNo,
      applicantName,
      serviceType,
      districtName,
      mandalName,
      villageName,
      surveyNo,
      khataNo: khataNo || 'N/A',
      currentStatus: 'Submitted',
      assignedOfficer: 'Village Revenue Officer (VRO)',
      remarks: 'Application acknowledged. Verification scheduled at Village Secretariat.',
      submissionDate: new Date()
    };

    if (getIsConnected()) {
      await ApplicationStatus.create(newApp);
    } else {
      inMemoryData.applications.unshift(newApp);
    }

    res.status(201).json({
      success: true,
      message: 'Application successfully registered with Village Secretariat.',
      data: newApp
    });
  } catch (error) {
    next(error);
  }
};
