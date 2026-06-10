'use strict';

/**
 * Tests for src/core/activation.js
 * hashActivationCode, verifyActivationCode, verifyRecoveryKey,
 * ActivationManager (activate, deactivate, recover, getStatus,
 * encryptRuntimeValue/decryptRuntimeValue).
 */

const crypto = require('crypto');

// Environment setup – MUST come before requiring the module
const ACTIVATION_CODE = 'my-secret-activation-code';
const ACTIVATION_HASH = crypto
  .createHash('sha256')
  .update(ACTIVATION_CODE)
  .digest('hex');

const RECOVERY_KEY = 'offline-recovery-key-123';
const RECOVERY_HASH = crypto
  .createHash('sha256')
  .update(RECOVERY_KEY)
  .digest('hex');

process.env.ACTIVATION_HASH = ACTIVATION_HASH;
process.env.RECOVERY_OFFLINE_KEY = RECOVERY_HASH;
process.env.LOYALTY_ENCRYPTION_SECRET = 'e'.repeat(64);
process.env.TOTP_SECRET = 'JBSWY3DPEHPK3PXP'; // base32 test secret

// Mock otplib to control TOTP verification deterministically
jest.mock('otplib', () => ({
  generate: jest.fn(({ secret }) => '123456'),
  verify: jest.fn(({ token }) => ({ valid: token === '123456' })),
}));

// Reset activation state between tests by re-requiring the module
let activation;
beforeEach(() => {
  jest.resetModules();
  jest.mock('otplib', () => ({
    generate: jest.fn(({ secret }) => '123456'),
    verify: jest.fn(({ token }) => ({ valid: token === '123456' })),
  }));
  process.env.ACTIVATION_HASH = ACTIVATION_HASH;
  process.env.RECOVERY_OFFLINE_KEY = RECOVERY_HASH;
  process.env.LOYALTY_ENCRYPTION_SECRET = 'e'.repeat(64);
  process.env.TOTP_SECRET = 'JBSWY3DPEHPK3PXP';
  activation = require('../src/core/activation');
});

// ---------------------------------------------------------------------------
// hashActivationCode
// ---------------------------------------------------------------------------

describe('hashActivationCode', () => {
  test('returns a 64-char hex SHA-256 hash', () => {
    const hash = activation.hashActivationCode('test');
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  test('produces consistent output for same input', () => {
    const a = activation.hashActivationCode('hello');
    const b = activation.hashActivationCode('hello');
    expect(a).toBe(b);
  });

  test('produces different output for different input', () => {
    const a = activation.hashActivationCode('one');
    const b = activation.hashActivationCode('two');
    expect(a).not.toBe(b);
  });
});

// ---------------------------------------------------------------------------
// verifyActivationCode
// ---------------------------------------------------------------------------

describe('verifyActivationCode', () => {
  test('returns true for correct activation code', () => {
    expect(activation.verifyActivationCode(ACTIVATION_CODE)).toBe(true);
  });

  test('returns false for wrong code', () => {
    expect(activation.verifyActivationCode('wrong-code')).toBe(false);
  });

  test('throws when ACTIVATION_HASH env is missing', () => {
    delete process.env.ACTIVATION_HASH;
    jest.resetModules();
    jest.mock('otplib', () => ({
      generate: jest.fn(({ secret }) => '123456'),
      verify: jest.fn(({ token }) => ({ valid: token === '123456' })),
    }));
    const mod = require('../src/core/activation');
    expect(() => mod.verifyActivationCode('x')).toThrow('ACTIVATION_HASH');
  });
});

// ---------------------------------------------------------------------------
// verifyRecoveryKey
// ---------------------------------------------------------------------------

describe('verifyRecoveryKey', () => {
  test('returns true for correct recovery key', () => {
    expect(activation.verifyRecoveryKey(RECOVERY_KEY)).toBe(true);
  });

  test('returns false for wrong key', () => {
    expect(activation.verifyRecoveryKey('bad-key')).toBe(false);
  });

  test('throws when RECOVERY_OFFLINE_KEY env is missing', () => {
    delete process.env.RECOVERY_OFFLINE_KEY;
    jest.resetModules();
    jest.mock('otplib', () => ({
      generate: jest.fn(({ secret }) => '123456'),
      verify: jest.fn(({ token }) => ({ valid: token === '123456' })),
    }));
    const mod = require('../src/core/activation');
    expect(() => mod.verifyRecoveryKey('x')).toThrow('RECOVERY_OFFLINE_KEY');
  });
});

// ---------------------------------------------------------------------------
// ActivationManager
// ---------------------------------------------------------------------------

describe('ActivationManager', () => {
  describe('getStatus', () => {
    test('starts deactivated', () => {
      const status = activation.ActivationManager.getStatus();
      expect(status.activated).toBe(false);
      expect(status.activatedAt).toBeNull();
      expect(status.dormantUntil).toBeNull();
    });
  });

  describe('activate', () => {
    test('succeeds with valid code and TOTP', async () => {
      const result = await activation.ActivationManager.activate({
        activationCode: ACTIVATION_CODE,
        totpToken: '123456',
        activatedBy: 'tester',
      });
      expect(result.success).toBe(true);
      expect(result.message).toContain('activated successfully');
      const status = activation.ActivationManager.getStatus();
      expect(status.activated).toBe(true);
      expect(status.activatedAt).toBeDefined();
    });

    test('fails with wrong activation code', async () => {
      const result = await activation.ActivationManager.activate({
        activationCode: 'wrong',
        totpToken: '123456',
        activatedBy: 'tester',
      });
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid activation code');
    });

    test('fails with wrong TOTP token', async () => {
      const result = await activation.ActivationManager.activate({
        activationCode: ACTIVATION_CODE,
        totpToken: '000000',
        activatedBy: 'tester',
      });
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid or expired TOTP');
    });

    test('fails if system already activated', async () => {
      await activation.ActivationManager.activate({
        activationCode: ACTIVATION_CODE,
        totpToken: '123456',
        activatedBy: 'tester',
      });
      const result = await activation.ActivationManager.activate({
        activationCode: ACTIVATION_CODE,
        totpToken: '123456',
        activatedBy: 'tester',
      });
      expect(result.success).toBe(false);
      expect(result.message).toContain('already activated');
    });
  });

  describe('deactivate', () => {
    test('succeeds with valid TOTP', async () => {
      // Activate first
      await activation.ActivationManager.activate({
        activationCode: ACTIVATION_CODE,
        totpToken: '123456',
        activatedBy: 'tester',
      });
      const result = await activation.ActivationManager.deactivate({
        totpToken: '123456',
        dormantUntil: '2030-01-01',
      });
      expect(result.success).toBe(true);
      const status = activation.ActivationManager.getStatus();
      expect(status.activated).toBe(false);
      expect(status.dormantUntil).toBe('2030-01-01');
    });

    test('fails with invalid TOTP', async () => {
      const result = await activation.ActivationManager.deactivate({
        totpToken: '000000',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('recover', () => {
    test('succeeds with valid recovery key and TOTP', async () => {
      const result = await activation.ActivationManager.recover({
        offlineKey: RECOVERY_KEY,
        totpToken: '123456',
      });
      expect(result.success).toBe(true);
      expect(result.message).toContain('Recovery successful');
    });

    test('fails with wrong recovery key', async () => {
      const result = await activation.ActivationManager.recover({
        offlineKey: 'bad',
        totpToken: '123456',
      });
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid offline recovery key');
    });

    test('fails with wrong TOTP', async () => {
      const result = await activation.ActivationManager.recover({
        offlineKey: RECOVERY_KEY,
        totpToken: '000000',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('encryptRuntimeValue / decryptRuntimeValue', () => {
    test('round-trips a plaintext value', () => {
      const plaintext = 'sensitive-data-here';
      const encrypted = activation.ActivationManager.encryptRuntimeValue(plaintext);
      expect(typeof encrypted).toBe('string');
      const decrypted = activation.ActivationManager.decryptRuntimeValue(encrypted);
      expect(decrypted).toBe(plaintext);
    });

    test('produces different ciphertext on each call', () => {
      const a = activation.ActivationManager.encryptRuntimeValue('same');
      const b = activation.ActivationManager.encryptRuntimeValue('same');
      expect(a).not.toBe(b);
    });
  });
});

// ---------------------------------------------------------------------------
// verifyTOTP / generateCurrentTOTP
// ---------------------------------------------------------------------------

describe('verifyTOTP', () => {
  test('returns true for valid token', async () => {
    const result = await activation.verifyTOTP('123456');
    expect(result).toBe(true);
  });

  test('returns false for invalid token', async () => {
    const result = await activation.verifyTOTP('999999');
    expect(result).toBe(false);
  });

  test('throws when TOTP_SECRET is not set', async () => {
    delete process.env.TOTP_SECRET;
    jest.resetModules();
    jest.mock('otplib', () => ({
      generate: jest.fn(),
      verify: jest.fn(),
    }));
    const mod = require('../src/core/activation');
    await expect(mod.verifyTOTP('123456')).rejects.toThrow('TOTP_SECRET');
  });
});

describe('generateCurrentTOTP', () => {
  test('returns a token string', async () => {
    const token = await activation.generateCurrentTOTP();
    expect(token).toBe('123456');
  });

  test('throws when TOTP_SECRET is not set', async () => {
    delete process.env.TOTP_SECRET;
    jest.resetModules();
    jest.mock('otplib', () => ({
      generate: jest.fn(),
      verify: jest.fn(),
    }));
    const mod = require('../src/core/activation');
    await expect(mod.generateCurrentTOTP()).rejects.toThrow('TOTP_SECRET');
  });
});
