const CaptchaService = require('../services/captchaService');
const { randomInt } = require('crypto');

// In-memory OTP simulation storage
const activeOtps = new Map();

const createOtp = () => randomInt(0, 1_000_000).toString().padStart(6, '0');
const getOtpKey = (loginType, identifier) => `${loginType}:${identifier}`;
const storeOtp = (loginType, identifier) => {
  const otp = createOtp();
  activeOtps.set(getOtpKey(loginType, identifier), { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
  return otp;
};

// POST /api/auth/otp/send
exports.sendOtp = (req, res) => {
  try {
    const { loginType = 'Citizen', mobileNumber, uid, username } = req.body;
    const isDevelopmentDemoOtp = (process.env.NODE_ENV === 'development' || process.env.ALLOW_DEMO_OTP === 'true') &&
      loginType === 'Citizen';

    if (loginType === 'Citizen') {
      if (!mobileNumber || !/^[6-9]\d{9}$/.test(String(mobileNumber).trim())) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
      }
      if (isDevelopmentDemoOtp) {
        return res.json({
          success: true,
          message: 'Demo sign-in is ready. Enter any six-digit number.'
        });
      }
      const normalizedMobile = String(mobileNumber).trim();
      const otp = storeOtp(loginType, normalizedMobile);
      return res.json({ 
        success: true, 
        message: 'Demo OTP generated. It expires in 5 minutes.',
        demoOtp: otp
      });
    }

    if (loginType === 'Uid') {
      if (!uid || String(uid).length < 12) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 12-digit Aadhaar number.' });
      }
      const otp = storeOtp(loginType, String(uid).trim());
      return res.json({ 
        success: true, 
        message: 'Aadhaar OTP dispatched to UIDAI linked mobile.',
        demoOtp: otp
      });
    }

    if (loginType === 'Officials') {
      if (!username) {
        return res.status(400).json({ success: false, message: 'Official User ID is required.' });
      }
      const otp = storeOtp(loginType, String(username).trim());
      return res.json({ 
        success: true, 
        message: 'Credentials verified. OTP sent to authorized revenue official.',
        demoOtp: otp
      });
    }

    return res.status(400).json({ success: false, message: 'Unknown login type.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error initiating OTP.' });
  }
};

// POST /api/auth/otp/verify
exports.verifyOtp = (req, res) => {
  try {
    const { loginType = 'Citizen', mobileNumber, uid, username, otp, captchaToken, captchaAnswer } = req.body;
    const isDevelopmentDemoOtp = (process.env.NODE_ENV === 'development' || process.env.ALLOW_DEMO_OTP === 'true') &&
      loginType === 'Citizen';

    const trimmedOtp = String(otp || '').trim();
    const normalizedMobile = String(mobileNumber || '').trim();
    const identifier = loginType === 'Citizen'
      ? normalizedMobile
      : loginType === 'Uid'
        ? String(uid || '').trim()
        : loginType === 'Officials'
          ? String(username || '').trim()
          : '';
    const otpKey = identifier ? getOtpKey(loginType, identifier) : '';
    const stored = otpKey ? activeOtps.get(otpKey) : null;

    // Optional captcha check if provided
    if (captchaToken || captchaAnswer) {
      if (!captchaToken || !captchaAnswer) {
        return res.status(400).json({ success: false, message: 'Captcha token and answer are both required.' });
      }
      const captchaRes = CaptchaService.verifyChallenge(captchaToken, captchaAnswer);
      if (!captchaRes.success) {
        return res.status(400).json({ success: false, message: captchaRes.message });
      }
    }

    if (!trimmedOtp) {
      return res.status(400).json({ success: false, message: 'Please enter the received OTP.' });
    }

    if (!/^\d{6}$/.test(trimmedOtp)) {
      return res.status(400).json({ success: false, message: 'Please enter the six-digit OTP.' });
    }

    if (!isDevelopmentDemoOtp) {
      if (!stored || stored.expiresAt <= Date.now()) {
        if (stored) activeOtps.delete(otpKey);
        return res.status(400).json({ success: false, message: 'OTP is invalid or expired. Please request a new OTP.' });
      }

      if (stored.otp !== trimmedOtp) {
        return res.status(400).json({ success: false, message: 'Invalid OTP. Please enter the code generated for this login.' });
      }

      activeOtps.delete(otpKey);
    }
    const formattedMobile = normalizedMobile || '8688778104';
    const masked = `${formattedMobile.slice(0, 2)}******${formattedMobile.slice(-2)}`;

    return res.json({
      success: true,
      message: 'Authentication successful. Welcome to MeeBhoomi portal.',
      user: {
        mobile: formattedMobile,
        masked,
        role: loginType,
        token: 'demo_auth_session_token_' + Date.now()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying OTP.' });
  }
};
