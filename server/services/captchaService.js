const crypto = require('crypto');

const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET ||
  (process.env.NODE_ENV !== 'production' ? crypto.randomBytes(32).toString('hex') : null);
if (!CAPTCHA_SECRET) {
  throw new Error('CAPTCHA_SECRET must be configured in production.');
}
const TOKEN_EXPIRY_MS = 3 * 60 * 1000; // 3 minutes

// In-memory store for consumed tokens to enforce one-time verification
const usedTokens = new Set();

// Clean up old tokens periodically
const cleanupInterval = setInterval(() => {
  usedTokens.clear();
}, 10 * 60 * 1000);
if (cleanupInterval.unref) {
  cleanupInterval.unref();
}

class CaptchaService {
  /**
   * Generates a random alphanumeric code
   */
  static generateCode(length = 5) {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Generates an SVG captcha image resembling the official government captcha
   */
  static generateSvg(text) {
    const width = 140;
    const height = 45;
    const colors = ['#004d26', '#8b0000', '#002f6c', '#b35900', '#2d3748'];
    
    // Draw noise lines
    let noiseLines = '';
    for (let i = 0; i < 4; i++) {
      const x1 = Math.floor(Math.random() * width);
      const y1 = Math.floor(Math.random() * height);
      const x2 = Math.floor(Math.random() * width);
      const y2 = Math.floor(Math.random() * height);
      const stroke = colors[Math.floor(Math.random() * colors.length)];
      noiseLines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="1.5" stroke-opacity="0.6" />`;
    }

    // Draw characters with rotation and slight offset
    let charElements = '';
    const charSpacing = width / (text.length + 1);
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const x = (i + 0.6) * charSpacing;
      const y = 28 + (Math.random() * 8 - 4);
      const rot = Math.floor(Math.random() * 30 - 15);
      const fill = colors[i % colors.length];
      charElements += `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="24" fill="${fill}" transform="rotate(${rot}, ${x}, ${y})">${char}</text>`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background-color: #f7fafc; border: 1px solid #cbd5e0; border-radius: 4px; user-select: none;">
      <rect width="100%" height="100%" fill="#f1f5f9" />
      ${noiseLines}
      ${charElements}
    </svg>`;
  }

  /**
   * Generates a challenge payload with signed token
   */
  static createChallenge() {
    const code = this.generateCode(5);
    const id = crypto.randomBytes(8).toString('hex');
    const expiresAt = Date.now() + TOKEN_EXPIRY_MS;

    const dataToSign = `${id}:${code.toUpperCase()}:${expiresAt}`;
    const signature = crypto.createHmac('sha256', CAPTCHA_SECRET).update(dataToSign).digest('hex');
    
    // Token contains payload + signature
    const token = Buffer.from(JSON.stringify({ id, expiresAt, sig: signature })).toString('base64');
    const svg = this.generateSvg(code);

    return {
      token,
      svg,
      expiresAt,
      // For automated unit test mode only:
      testCode: process.env.NODE_ENV === 'test' ? code : undefined
    };
  }

  /**
   * Verifies the answer against the signed token
   */
  static verifyChallenge(token, userAnswer) {
    if (!token || !userAnswer) {
      return { success: false, message: 'Captcha token and answer are required.' };
    }

    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      const { id, expiresAt, sig } = decoded;

      if (!id || !expiresAt || !sig) {
        return { success: false, message: 'Invalid captcha token structure.' };
      }

      if (usedTokens.has(id)) {
        return { success: false, message: 'Captcha has already been used. Please refresh.' };
      }

      if (Date.now() > expiresAt) {
        return { success: false, message: 'Captcha challenge has expired. Please refresh.' };
      }

      const formattedAnswer = String(userAnswer).trim().toUpperCase();

      // Test bypass for dev/test adapter if explicit test key provided
      if (process.env.NODE_ENV === 'test' && formattedAnswer === 'TEST_PASS') {
        usedTokens.add(id);
        return { success: true };
      }

      const expectedSign = crypto.createHmac('sha256', CAPTCHA_SECRET)
        .update(`${id}:${formattedAnswer}:${expiresAt}`)
        .digest('hex');

      if (crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expectedSign, 'hex'))) {
        // Mark as used
        usedTokens.add(id);
        return { success: true };
      } else {
        return { success: false, message: 'Incorrect captcha code entered. Please try again.' };
      }
    } catch (err) {
      return { success: false, message: 'Invalid or corrupted captcha token.' };
    }
  }
}

module.exports = CaptchaService;
