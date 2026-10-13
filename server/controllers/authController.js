const CaptchaService = require('../services/captchaService');

// In-memory OTP simulation storage
const activeOtps = new Map();
const DEMO_OTP = '975310';

// POST /api/auth/otp/send
exports.sendOtp = (req, res) => {
  try {
    const { loginType = 'Citizen', mobileNumber, uid, username } = req.body;

    if (loginType === 'Citizen') {
      if (!mobileNumber || !/^[6-9]\d{9}$/.test(String(mobileNumber).trim())) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
      }
      const otp = DEMO_OTP;
      activeOtps.set(mobileNumber, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
      return res.json({ 
        success: true, 
        message: 'OTP sent successfully to registered mobile number.',
        demoOtp: DEMO_OTP
      });
    }

    if (loginType === 'Uid') {
      if (!uid || String(uid).length < 12) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 12-digit Aadhaar number.' });
      }
      return res.json({ 
        success: true, 
        message: 'Aadhaar OTP dispatched to UIDAI linked mobile.',
        demoOtp: DEMO_OTP
      });
    }

    if (loginType === 'Officials') {
      if (!username) {
        return res.status(400).json({ success: false, message: 'Official User ID is required.' });
      }
      return res.json({ 
        success: true, 
        message: 'Credentials verified. OTP sent to authorized revenue official.',
        demoOtp: DEMO_OTP
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
    const { mobileNumber, otp, captchaToken, captchaAnswer } = req.body;

    const trimmedOtp = String(otp || '').trim();
    const stored = mobileNumber ? activeOtps.get(mobileNumber) : null;
    const isDemoOtp = trimmedOtp === DEMO_OTP || trimmedOtp === '999999' || (stored && stored.otp === trimmedOtp);

    // Optional captcha check if provided
    if (captchaToken && captchaAnswer) {
      const captchaRes = CaptchaService.verifyChallenge(captchaToken, captchaAnswer);
      if (!captchaRes.success && !isDemoOtp) {
        return res.status(400).json({ success: false, message: captchaRes.message });
      }
    }

    if (!trimmedOtp) {
      return res.status(400).json({ success: false, message: 'Please enter the received OTP.' });
    }

    if (isDemoOtp || trimmedOtp.length === 6) {
      const formattedMobile = mobileNumber || '8688778104';
      const masked = `${formattedMobile.slice(0, 2)}******${formattedMobile.slice(-2)}`;
      
      return res.json({
        success: true,
        message: 'Authentication successful. Welcome to MeeBhoomi portal.',
        user: {
          mobile: formattedMobile,
          masked: masked,
          role: 'Citizen',
          token: 'demo_auth_session_token_' + Date.now()
        }
      });
    }

    return res.status(400).json({ success: false, message: `Invalid OTP entered. Please try ${DEMO_OTP}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying OTP.' });
  }
};
