// Lightweight in-memory rate limiter
const ipRequests = new Map();

const rateLimiter = (options = { windowMs: 60 * 1000, max: 60 }) => {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    const clientData = ipRequests.get(ip) || { count: 0, resetTime: now + options.windowMs };

    if (now > clientData.resetTime) {
      clientData.count = 1;
      clientData.resetTime = now + options.windowMs;
    } else {
      clientData.count += 1;
    }

    ipRequests.set(ip, clientData);

    if (clientData.count > options.max) {
      return res.status(429).json({
        success: false,
        message: 'Too many search requests from this client. Please wait a moment and try again.'
      });
    }

    next();
  };
};

module.exports = rateLimiter;
