'use strict';

/**
 * Tests for src/middleware/validation.js
 * Validates the exported validation chains by running them through express-validator.
 */

process.env.NODE_ENV = 'test';

const express = require('express');
const request = require('supertest');

const {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateArtistCreate,
  validateArtistUpdate,
  validateMongoId,
  validatePagination,
  validateDateRange,
} = require('../src/middleware/validation');

// ---------------------------------------------------------------------------
// Helper – create a mini Express app with validation middleware
// ---------------------------------------------------------------------------

function makeApp(validators, method = 'post', path = '/test') {
  const app = express();
  app.use(express.json());
  if (method === 'post') {
    app.post(path, ...validators, (_req, res) => res.json({ success: true }));
  } else {
    app.get(path, ...validators, (_req, res) => res.json({ success: true }));
  }
  // Error handler to format operational errors
  app.use((err, _req, res, _next) => {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  });
  return app;
}

// ---------------------------------------------------------------------------
// validateUserRegistration
// ---------------------------------------------------------------------------

describe('validateUserRegistration', () => {
  const app = makeApp(validateUserRegistration);

  test('passes with valid registration data', async () => {
    const res = await request(app).post('/test').send({
      username: 'validuser',
      email: 'user@example.com',
      password: 'Password1',
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('rejects short username', async () => {
    const res = await request(app).post('/test').send({
      username: 'ab',
      email: 'user@example.com',
      password: 'Password1',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Username');
  });

  test('rejects invalid email', async () => {
    const res = await request(app).post('/test').send({
      username: 'validuser',
      email: 'not-an-email',
      password: 'Password1',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('email');
  });

  test('rejects weak password (no uppercase)', async () => {
    const res = await request(app).post('/test').send({
      username: 'validuser',
      email: 'user@example.com',
      password: 'password1',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Password');
  });

  test('rejects invalid role', async () => {
    const res = await request(app).post('/test').send({
      username: 'validuser',
      email: 'user@example.com',
      password: 'Password1',
      role: 'superadmin',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('role');
  });
});

// ---------------------------------------------------------------------------
// validateUserLogin
// ---------------------------------------------------------------------------

describe('validateUserLogin', () => {
  const app = makeApp(validateUserLogin);

  test('passes with valid credentials', async () => {
    const res = await request(app).post('/test').send({
      email: 'user@example.com',
      password: 'anypassword',
    });
    expect(res.status).toBe(200);
  });

  test('rejects missing password', async () => {
    const res = await request(app).post('/test').send({
      email: 'user@example.com',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Password');
  });

  test('rejects invalid email', async () => {
    const res = await request(app).post('/test').send({
      email: 'bad',
      password: 'pw',
    });
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// validateUserUpdate
// ---------------------------------------------------------------------------

describe('validateUserUpdate', () => {
  const app = makeApp(validateUserUpdate);

  test('passes with no fields (all optional)', async () => {
    const res = await request(app).post('/test').send({});
    expect(res.status).toBe(200);
  });

  test('rejects username with special characters', async () => {
    const res = await request(app).post('/test').send({
      username: 'bad user!',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Username');
  });
});

// ---------------------------------------------------------------------------
// validateArtistCreate
// ---------------------------------------------------------------------------

describe('validateArtistCreate', () => {
  const app = makeApp(validateArtistCreate);

  test('passes with valid artist data', async () => {
    const res = await request(app).post('/test').send({
      name: 'DJ Goat',
    });
    expect(res.status).toBe(200);
  });

  test('rejects missing name', async () => {
    const res = await request(app).post('/test').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Artist name');
  });

  test('rejects invalid email for artist', async () => {
    const res = await request(app).post('/test').send({
      name: 'DJ Goat',
      email: 'not-email',
    });
    expect(res.status).toBe(400);
  });

  test('rejects bio over 2000 chars', async () => {
    const res = await request(app).post('/test').send({
      name: 'DJ Goat',
      bio: 'x'.repeat(2001),
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Bio');
  });
});

// ---------------------------------------------------------------------------
// validateArtistUpdate
// ---------------------------------------------------------------------------

describe('validateArtistUpdate', () => {
  const app = makeApp(validateArtistUpdate);

  test('passes with empty body (all optional)', async () => {
    const res = await request(app).post('/test').send({});
    expect(res.status).toBe(200);
  });

  test('rejects name over 100 chars', async () => {
    const res = await request(app).post('/test').send({
      name: 'x'.repeat(101),
    });
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// validateMongoId
// ---------------------------------------------------------------------------

describe('validateMongoId', () => {
  const app = makeApp(validateMongoId('id'), 'get', '/test/:id');

  test('passes with valid MongoDB ObjectId', async () => {
    const res = await request(app).get('/test/507f1f77bcf86cd799439011');
    expect(res.status).toBe(200);
  });

  test('rejects invalid ObjectId', async () => {
    const res = await request(app).get('/test/not-a-mongo-id');
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid');
  });
});

// ---------------------------------------------------------------------------
// validatePagination
// ---------------------------------------------------------------------------

describe('validatePagination', () => {
  const app = makeApp(validatePagination, 'get', '/test');

  test('passes with no query params', async () => {
    const res = await request(app).get('/test');
    expect(res.status).toBe(200);
  });

  test('passes with valid page and limit', async () => {
    const res = await request(app).get('/test?page=2&limit=50');
    expect(res.status).toBe(200);
  });

  test('rejects page=0', async () => {
    const res = await request(app).get('/test?page=0');
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Page');
  });

  test('rejects limit over 100', async () => {
    const res = await request(app).get('/test?limit=101');
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Limit');
  });
});

// ---------------------------------------------------------------------------
// validateDateRange
// ---------------------------------------------------------------------------

describe('validateDateRange', () => {
  const app = makeApp(validateDateRange, 'get', '/test');

  test('passes with no date params', async () => {
    const res = await request(app).get('/test');
    expect(res.status).toBe(200);
  });

  test('passes with valid date range', async () => {
    const res = await request(app).get('/test?startDate=2024-01-01&endDate=2024-12-31');
    expect(res.status).toBe(200);
  });

  test('rejects invalid start date format', async () => {
    const res = await request(app).get('/test?startDate=not-a-date');
    expect(res.status).toBe(400);
  });

  test('rejects end date before start date', async () => {
    const res = await request(app).get('/test?startDate=2024-06-01&endDate=2024-01-01');
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('End date');
  });
});
