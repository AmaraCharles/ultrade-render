const rateLimit = require("express-rate-limit");

// ─── HELPERS ────────────────────────────────────────────────────────────────

function rateLimitResponse(res, retryAfter) {
  res.status(429).json({
    success: false,
    status: 429,
    message: "Too many requests. Please slow down and try again later.",
    retryAfter,
  });
}

// ─── LIMITERS ────────────────────────────────────────────────────────────────

/**
 * AUTH limiter — register, login, forgot-password
 * Tight: 10 attempts per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const retryAfter = Math.ceil(req.rateLimit.resetTime / 1000 - Date.now() / 1000);
    rateLimitResponse(res, retryAfter);
  },
  keyGenerator: (req) => req.ip,
});

/**
 * OTP/verification limiter — stricter to stop OTP brute force
 * 5 attempts per 10 minutes per IP
 */
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const retryAfter = Math.ceil(req.rateLimit.resetTime / 1000 - Date.now() / 1000);
    rateLimitResponse(res, retryAfter);
  },
  keyGenerator: (req) => req.ip,
});

/**
 * Financial limiter — deposit, withdrawal, trade
 * 20 requests per 10 minutes per IP
 */
const financialLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const retryAfter = Math.ceil(req.rateLimit.resetTime / 1000 - Date.now() / 1000);
    rateLimitResponse(res, retryAfter);
  },
  keyGenerator: (req) => req.ip,
});

/**
 * General API limiter — everything else
 * 100 requests per 15 minutes per IP
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const retryAfter = Math.ceil(req.rateLimit.resetTime / 1000 - Date.now() / 1000);
    rateLimitResponse(res, retryAfter);
  },
  keyGenerator: (req) => req.ip,
});

/**
 * Brute-force lockout limiter — very tight for admin-sensitive endpoints
 * 5 requests per 30 minutes per IP (KYC approve/reject, transaction confirm)
 */
const adminActionLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const retryAfter = Math.ceil(req.rateLimit.resetTime / 1000 - Date.now() / 1000);
    rateLimitResponse(res, retryAfter);
  },
  keyGenerator: (req) => req.ip,
});

module.exports = {
  authLimiter,
  otpLimiter,
  financialLimiter,
  generalLimiter,
  adminActionLimiter,
};