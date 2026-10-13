const express = require('express');
const router = express.Router();

const districtController = require('../controllers/districtController');
const recordController = require('../controllers/recordController');
const captchaController = require('../controllers/captchaController');
const applicationController = require('../controllers/applicationController');
const authController = require('../controllers/authController');
const rateLimiter = require('../middleware/rateLimiter');
const { validateSearchInput } = require('../middleware/validator');
const { getIsConnected } = require('../config/db');
const verifyCaptcha = require('../middleware/verifyCaptcha');

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    database: getIsConnected() ? 'mongodb' : 'in-memory-demo',
    service: 'MeeBhoomi Andhra Pradesh Public Land Records API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Captcha Endpoints
router.get('/captcha/generate', captchaController.generateCaptcha);
router.post('/captcha/verify', captchaController.verifyCaptcha);

// Location Hierarchy Endpoints
router.get('/districts', districtController.getDistricts);
router.get('/mandals', districtController.getMandals);
router.get('/villages', districtController.getVillages);

// Land Records Endpoints (with rate limiting and input validation)
router.post('/records/search', rateLimiter({ windowMs: 60 * 1000, max: 40 }), validateSearchInput, recordController.searchRecords);
router.get('/records/village-adangal', rateLimiter({ windowMs: 60 * 1000, max: 40 }), verifyCaptcha, recordController.getVillageAdangal);
router.get('/records/village-1b', rateLimiter({ windowMs: 60 * 1000, max: 40 }), verifyCaptcha, recordController.getVillage1B);
router.get('/records/:id', recordController.getRecordById);

// Application Tracking Endpoints
router.get('/applications/status/survey/:surveyNo', rateLimiter({ windowMs: 60 * 1000, max: 20 }), verifyCaptcha, applicationController.getApplicationStatusBySurveyNo);
router.get('/applications/status/:applicationNo', rateLimiter({ windowMs: 60 * 1000, max: 20 }), verifyCaptcha, applicationController.getApplicationStatus);
router.post('/applications/submit', applicationController.submitApplication);

// Authentication / OTP Endpoints
router.post('/auth/otp/send', authController.sendOtp);
router.post('/auth/otp/verify', authController.verifyOtp);

module.exports = router;
