const CaptchaService = require('../services/captchaService');

const verifyCaptcha = (req, res, next) => {
  const values = req.method === 'GET' ? req.query : req.body;
  const captchaToken = req.get('X-Captcha-Token') || values.captchaToken;
  const captchaAnswer = req.get('X-Captcha-Answer') || values.captchaAnswer;

  if (!captchaToken || !captchaAnswer) {
    return res.status(400).json({
      success: false,
      message: 'Captcha code is required to view land records.'
    });
  }

  const result = CaptchaService.verifyChallenge(captchaToken, captchaAnswer);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.message || 'Invalid or expired captcha.'
    });
  }

  next();
};

module.exports = verifyCaptcha;
