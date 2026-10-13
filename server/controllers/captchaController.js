const CaptchaService = require('../services/captchaService');

// GET /api/captcha/generate
exports.generateCaptcha = (req, res) => {
  try {
    const challenge = CaptchaService.createChallenge();
    res.json({
      success: true,
      data: {
        token: challenge.token,
        svg: challenge.svg,
        expiresAt: challenge.expiresAt,
        testCode: challenge.testCode
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate captcha.' });
  }
};

// POST /api/captcha/verify
exports.verifyCaptcha = (req, res) => {
  try {
    const { token, answer } = req.body;
    const result = CaptchaService.verifyChallenge(token, answer);
    if (result.success) {
      return res.json({ success: true, message: 'Captcha verified successfully.' });
    } else {
      return res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Captcha verification error.' });
  }
};
