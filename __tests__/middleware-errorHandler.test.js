'use strict';

/**
 * Tests for src/middleware/errorHandler.js
 * errorHandler, asyncHandler, AppError, notFound, validationError,
 * databaseErrorHandler, rateLimitHandler.
 */

const {
  errorHandler,
  asyncHandler,
  AppError,
  notFound,
  validationError,
  databaseErrorHandler,
  rateLimitHandler,
} = require('../src/middleware/errorHandler');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockRes() {
  const res = {
    statusCode: null,
    body: null,
    headers: {},
    status(code) {
      res.statusCode = code;
      return res;
    },
    json(data) {
      res.body = data;
      return res;
    },
    get(key) {
      return res.headers[key];
    },
    set(key, value) {
      res.headers[key] = value;
    },
  };
  return res;
}

function mockReq(overrides = {}) {
  return { originalUrl: '/test-path', ...overrides };
}

// ---------------------------------------------------------------------------
// AppError
// ---------------------------------------------------------------------------

describe('AppError', () => {
  test('creates an operational error with statusCode', () => {
    const err = new AppError('Not allowed', 403);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Not allowed');
    expect(err.statusCode).toBe(403);
    expect(err.status).toBe('fail');
    expect(err.isOperational).toBe(true);
  });

  test('sets status to "error" for 5xx codes', () => {
    const err = new AppError('Server broke', 500);
    expect(err.status).toBe('error');
  });

  test('captures a stack trace', () => {
    const err = new AppError('oops', 400);
    expect(err.stack).toBeDefined();
    expect(err.stack).toContain('oops');
  });
});

// ---------------------------------------------------------------------------
// errorHandler middleware
// ---------------------------------------------------------------------------

describe('errorHandler', () => {
  const originalEnv = process.env.NODE_ENV;
  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  test('handles CastError (bad ObjectId)', () => {
    const err = new Error('Cast failed');
    err.name = 'CastError';
    const res = mockRes();
    errorHandler(err, mockReq(), res, jest.fn());
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Resource not found');
  });

  test('handles duplicate key error (code 11000)', () => {
    const err = new Error('dup');
    err.code = 11000;
    const res = mockRes();
    errorHandler(err, mockReq(), res, jest.fn());
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Duplicate field value entered');
  });

  test('handles Mongoose ValidationError', () => {
    const err = new Error('Validation failed');
    err.name = 'ValidationError';
    err.errors = {
      name: { message: 'Name is required' },
      email: { message: 'Email is invalid' },
    };
    const res = mockRes();
    errorHandler(err, mockReq(), res, jest.fn());
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('Name is required');
    expect(res.body.message).toContain('Email is invalid');
  });

  test('handles JsonWebTokenError', () => {
    const err = new Error('jwt malformed');
    err.name = 'JsonWebTokenError';
    const res = mockRes();
    errorHandler(err, mockReq(), res, jest.fn());
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid token');
  });

  test('handles TokenExpiredError', () => {
    const err = new Error('token expired');
    err.name = 'TokenExpiredError';
    const res = mockRes();
    errorHandler(err, mockReq(), res, jest.fn());
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Token expired');
  });

  test('handles LIMIT_FILE_SIZE', () => {
    const err = new Error('too large');
    err.code = 'LIMIT_FILE_SIZE';
    const res = mockRes();
    errorHandler(err, mockReq(), res, jest.fn());
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('File too large');
  });

  test('handles LIMIT_FILE_COUNT', () => {
    const err = new Error('too many');
    err.code = 'LIMIT_FILE_COUNT';
    const res = mockRes();
    errorHandler(err, mockReq(), res, jest.fn());
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Too many files');
  });

  test('handles LIMIT_UNEXPECTED_FILE', () => {
    const err = new Error('unexpected');
    err.code = 'LIMIT_UNEXPECTED_FILE';
    const res = mockRes();
    errorHandler(err, mockReq(), res, jest.fn());
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Unexpected file field');
  });

  test('handles operational (AppError) errors', () => {
    const err = new AppError('Forbidden', 403);
    const res = mockRes();
    errorHandler(err, mockReq(), res, jest.fn());
    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Forbidden');
  });

  test('includes stack in development for operational errors', () => {
    process.env.NODE_ENV = 'development';
    const err = new AppError('dev err', 400);
    const res = mockRes();
    errorHandler(err, mockReq(), res, jest.fn());
    expect(res.body.stack).toBeDefined();
  });

  test('omits stack in production for default errors', () => {
    process.env.NODE_ENV = 'production';
    const err = new Error('generic');
    const res = mockRes();
    errorHandler(err, mockReq(), res, jest.fn());
    expect(res.body.stack).toBeUndefined();
  });

  test('defaults to 500 when statusCode is not set', () => {
    const err = new Error('unknown');
    const res = mockRes();
    errorHandler(err, mockReq(), res, jest.fn());
    expect(res.statusCode).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// asyncHandler
// ---------------------------------------------------------------------------

describe('asyncHandler', () => {
  test('calls next with error if async function rejects', async () => {
    const next = jest.fn();
    const handler = asyncHandler(async () => {
      throw new Error('async fail');
    });
    await handler({}, {}, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test('does not call next on success', async () => {
    const next = jest.fn();
    const res = mockRes();
    const handler = asyncHandler(async (_req, r) => {
      r.status(200).json({ ok: true });
    });
    await handler({}, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });
});

// ---------------------------------------------------------------------------
// notFound
// ---------------------------------------------------------------------------

describe('notFound', () => {
  test('creates a 404 AppError and calls next', () => {
    const next = jest.fn();
    notFound(mockReq({ originalUrl: '/missing' }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(404);
    expect(err.message).toContain('/missing');
  });
});

// ---------------------------------------------------------------------------
// validationError
// ---------------------------------------------------------------------------

describe('validationError', () => {
  test('creates a 400 AppError from validation result', () => {
    const fakeErrors = {
      array: () => [
        { param: 'email', msg: 'Invalid email', value: 'bad' },
        { param: 'name', msg: 'Required', value: '' },
      ],
    };
    const err = validationError(fakeErrors);
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toContain('Invalid email');
    expect(err.message).toContain('Required');
  });
});

// ---------------------------------------------------------------------------
// databaseErrorHandler
// ---------------------------------------------------------------------------

describe('databaseErrorHandler', () => {
  test('wraps MongoNetworkError as 503 AppError', () => {
    const err = new Error('net');
    err.name = 'MongoNetworkError';
    const result = databaseErrorHandler(err);
    expect(result).toBeInstanceOf(AppError);
    expect(result.statusCode).toBe(503);
  });

  test('wraps MongoTimeoutError as 503 AppError', () => {
    const err = new Error('timeout');
    err.name = 'MongoTimeoutError';
    const result = databaseErrorHandler(err);
    expect(result).toBeInstanceOf(AppError);
    expect(result.statusCode).toBe(503);
  });

  test('wraps MongoServerSelectionError as 503 AppError', () => {
    const err = new Error('selection');
    err.name = 'MongoServerSelectionError';
    const result = databaseErrorHandler(err);
    expect(result).toBeInstanceOf(AppError);
    expect(result.statusCode).toBe(503);
  });

  test('wraps MongoAuthError as 500 AppError', () => {
    const err = new Error('auth');
    err.name = 'MongoAuthError';
    const result = databaseErrorHandler(err);
    expect(result).toBeInstanceOf(AppError);
    expect(result.statusCode).toBe(500);
  });

  test('returns unknown errors unchanged', () => {
    const err = new Error('something else');
    const result = databaseErrorHandler(err);
    expect(result).toBe(err);
  });
});

// ---------------------------------------------------------------------------
// rateLimitHandler
// ---------------------------------------------------------------------------

describe('rateLimitHandler', () => {
  test('responds with 429 and retryAfter', () => {
    const res = mockRes();
    res.headers['Retry-After'] = '120';
    rateLimitHandler(mockReq(), res);
    expect(res.statusCode).toBe(429);
    expect(res.body.success).toBe(false);
    expect(res.body.retryAfter).toBe('120');
  });

  test('defaults retryAfter to 60 when header not set', () => {
    const res = mockRes();
    rateLimitHandler(mockReq(), res);
    expect(res.body.retryAfter).toBe('60');
  });
});
