'use strict';

/**
 * Tests for src/middleware/auth.js
 * protect, authorize, optionalAuth, checkOwnership,
 * requireEmailVerification, checkArtistAccess.
 */

process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';

const jwt = require('jsonwebtoken');

// Mock User model
jest.mock('../src/models/User', () => {
  const users = new Map();
  const model = {
    findById: jest.fn((id) => ({
      select: jest.fn().mockResolvedValue(users.get(id) || null),
    })),
    _setUser: (id, user) => users.set(id, user),
    _clear: () => users.clear(),
  };
  return model;
});

// Mock Artist model
jest.mock('../src/models/Artist', () => ({
  findOne: jest.fn(),
}));

const User = require('../src/models/User');
const Artist = require('../src/models/Artist');
const {
  protect,
  authorize,
  optionalAuth,
  checkOwnership,
  requireEmailVerification,
  checkArtistAccess,
} = require('../src/middleware/auth');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockRes() {
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      res.statusCode = code;
      return res;
    },
    json(data) {
      res.body = data;
      return res;
    },
  };
  return res;
}

function mockReq(overrides = {}) {
  return { headers: {}, params: {}, ...overrides };
}

function generateToken(payload, secret = process.env.JWT_SECRET) {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

// ---------------------------------------------------------------------------
// protect
// ---------------------------------------------------------------------------

describe('protect', () => {
  beforeEach(() => {
    User._clear();
  });

  test('returns 401 when no authorization header is present', async () => {
    const req = mockReq();
    const res = mockRes();
    const next = jest.fn();
    await protect(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toContain('no token');
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 when token is invalid', async () => {
    const req = mockReq({ headers: { authorization: 'Bearer invalidtoken' } });
    const res = mockRes();
    const next = jest.fn();
    await protect(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toContain('token failed');
  });

  test('returns 401 when user not found in database', async () => {
    const token = generateToken({ id: 'nonexistent-user' });
    const req = mockReq({ headers: { authorization: `Bearer ${token}` } });
    const res = mockRes();
    const next = jest.fn();
    await protect(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toContain('User not found');
  });

  test('returns 401 when user account is deactivated', async () => {
    User._setUser('user-1', { id: 'user-1', isActive: false, role: 'admin' });
    const token = generateToken({ id: 'user-1' });
    const req = mockReq({ headers: { authorization: `Bearer ${token}` } });
    const res = mockRes();
    const next = jest.fn();
    await protect(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toContain('deactivated');
  });

  test('calls next and sets req.user on valid token', async () => {
    const user = { id: 'user-2', isActive: true, role: 'admin' };
    User._setUser('user-2', user);
    const token = generateToken({ id: 'user-2' });
    const req = mockReq({ headers: { authorization: `Bearer ${token}` } });
    const res = mockRes();
    const next = jest.fn();
    await protect(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(user);
  });
});

// ---------------------------------------------------------------------------
// authorize
// ---------------------------------------------------------------------------

describe('authorize', () => {
  test('calls next when user role matches', () => {
    const middleware = authorize('admin', 'manager');
    const req = mockReq({ user: { role: 'admin' } });
    const res = mockRes();
    const next = jest.fn();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('returns 403 when user role does not match', () => {
    const middleware = authorize('admin');
    const req = mockReq({ user: { role: 'viewer' } });
    const res = mockRes();
    const next = jest.fn();
    middleware(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toContain('viewer');
    expect(next).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// optionalAuth
// ---------------------------------------------------------------------------

describe('optionalAuth', () => {
  beforeEach(() => {
    User._clear();
  });

  test('sets req.user to null and calls next when no header', async () => {
    const req = mockReq();
    const res = mockRes();
    const next = jest.fn();
    await optionalAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    // user should be undefined or null (no crash)
  });

  test('sets req.user when valid token provided', async () => {
    const user = { id: 'user-opt', isActive: true, role: 'artist' };
    User._setUser('user-opt', user);
    const token = generateToken({ id: 'user-opt' });
    const req = mockReq({ headers: { authorization: `Bearer ${token}` } });
    const res = mockRes();
    const next = jest.fn();
    await optionalAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(user);
  });

  test('sets req.user to null on invalid token and still calls next', async () => {
    const req = mockReq({ headers: { authorization: 'Bearer badtoken' } });
    const res = mockRes();
    const next = jest.fn();
    await optionalAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// checkOwnership
// ---------------------------------------------------------------------------

describe('checkOwnership', () => {
  test('allows admin to pass regardless of ownership', () => {
    const middleware = checkOwnership('user');
    const req = mockReq({ user: { id: 'u1', role: 'admin' }, resource: { user: 'u2' } });
    const res = mockRes();
    const next = jest.fn();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('allows manager to pass regardless of ownership', () => {
    const middleware = checkOwnership('user');
    const req = mockReq({ user: { id: 'u1', role: 'manager' }, resource: { user: 'u2' } });
    const res = mockRes();
    const next = jest.fn();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('allows resource owner to pass', () => {
    const middleware = checkOwnership('user');
    const req = mockReq({ user: { id: 'u1', role: 'artist' }, resource: { user: { toString: () => 'u1' } } });
    const res = mockRes();
    const next = jest.fn();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('denies non-owner with non-privileged role', () => {
    const middleware = checkOwnership('user');
    const req = mockReq({ user: { id: 'u1', role: 'artist' }, resource: { user: { toString: () => 'u2' } } });
    const res = mockRes();
    const next = jest.fn();
    middleware(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('allows when resource is missing (no resource set)', () => {
    const middleware = checkOwnership('user');
    const req = mockReq({ user: { id: 'u1', role: 'artist' } });
    const res = mockRes();
    const next = jest.fn();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// requireEmailVerification
// ---------------------------------------------------------------------------

describe('requireEmailVerification', () => {
  test('calls next when email is verified', () => {
    const req = mockReq({ user: { emailVerified: true } });
    const res = mockRes();
    const next = jest.fn();
    requireEmailVerification(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('returns 403 when email is not verified', () => {
    const req = mockReq({ user: { emailVerified: false } });
    const res = mockRes();
    const next = jest.fn();
    requireEmailVerification(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toContain('Email verification');
  });
});

// ---------------------------------------------------------------------------
// checkArtistAccess
// ---------------------------------------------------------------------------

describe('checkArtistAccess', () => {
  beforeEach(() => {
    Artist.findOne.mockReset();
  });

  test('allows admin without artist lookup', async () => {
    const req = mockReq({ user: { id: 'u1', role: 'admin' }, params: {} });
    const res = mockRes();
    const next = jest.fn();
    await checkArtistAccess(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(Artist.findOne).not.toHaveBeenCalled();
  });

  test('allows manager without artist lookup', async () => {
    const req = mockReq({ user: { id: 'u1', role: 'manager' }, params: {} });
    const res = mockRes();
    const next = jest.fn();
    await checkArtistAccess(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('returns 403 when artist profile not found', async () => {
    Artist.findOne.mockResolvedValue(null);
    const req = mockReq({ user: { id: 'u1', role: 'artist' }, params: {} });
    const res = mockRes();
    const next = jest.fn();
    await checkArtistAccess(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toContain('Artist profile not found');
  });

  test('returns 403 when artist accesses another artist', async () => {
    Artist.findOne.mockResolvedValue({ _id: { toString: () => 'artist-1' } });
    const req = mockReq({
      user: { id: 'u1', role: 'artist' },
      params: { artistId: 'artist-2' },
    });
    const res = mockRes();
    const next = jest.fn();
    await checkArtistAccess(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toContain('Not authorized');
  });

  test('allows artist to access own data', async () => {
    Artist.findOne.mockResolvedValue({ _id: { toString: () => 'artist-1' } });
    const req = mockReq({
      user: { id: 'u1', role: 'artist' },
      params: { artistId: 'artist-1' },
    });
    const res = mockRes();
    const next = jest.fn();
    await checkArtistAccess(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.artistProfile).toBeDefined();
  });

  test('returns 500 on database error', async () => {
    Artist.findOne.mockRejectedValue(new Error('DB down'));
    const req = mockReq({ user: { id: 'u1', role: 'artist' }, params: {} });
    const res = mockRes();
    const next = jest.fn();
    await checkArtistAccess(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toContain('Error checking artist access');
  });
});
