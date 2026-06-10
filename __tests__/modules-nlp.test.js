'use strict';

/**
 * Tests for src/modules/nlp/NlpModule.js
 * Covers: initialization (clauseLibrary, riskIndicators), matchesContract,
 * findContext, getRecommendation, getTemplates, detectRedFlags (keyword path).
 */

// Mock axios so no real HTTP calls are made
jest.mock('axios');
const axios = require('axios');

const NlpModule = require('../src/modules/nlp/NlpModule');

let nlp;

beforeEach(() => {
  nlp = new NlpModule({ ollamaUrl: 'http://fake:11434' });
});

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

describe('NlpModule initialization', () => {
  test('sets up clauseLibrary with expected keys', () => {
    expect(nlp.clauseLibrary.size).toBeGreaterThanOrEqual(4);
    expect(nlp.clauseLibrary.has('termination')).toBe(true);
    expect(nlp.clauseLibrary.has('royalty')).toBe(true);
    expect(nlp.clauseLibrary.has('territory')).toBe(true);
    expect(nlp.clauseLibrary.has('obligation')).toBe(true);
  });

  test('sets up riskIndicators with expected keys', () => {
    expect(nlp.riskIndicators.size).toBeGreaterThanOrEqual(4);
    expect(nlp.riskIndicators.has('perpetuity')).toBe(true);
    expect(nlp.riskIndicators.has('workForHire')).toBe(true);
    expect(nlp.riskIndicators.has('broadLicense')).toBe(true);
    expect(nlp.riskIndicators.has('unfairDeductions')).toBe(true);
  });

  test('clauseLibrary entries have keywords and importance', () => {
    const termination = nlp.clauseLibrary.get('termination');
    expect(termination.keywords).toBeInstanceOf(Array);
    expect(termination.keywords.length).toBeGreaterThan(0);
    expect(termination.importance).toBeDefined();
  });

  test('riskIndicators entries have description, severity, and keywords', () => {
    const perpetuity = nlp.riskIndicators.get('perpetuity');
    expect(perpetuity.description).toBeDefined();
    expect(perpetuity.severity).toBe('high');
    expect(perpetuity.keywords).toBeInstanceOf(Array);
  });

  test('uses custom config values', () => {
    const custom = new NlpModule({
      ollamaUrl: 'http://custom:1234',
      ollamaModel: 'custom-model',
      maxResults: 5,
    });
    expect(custom.config.ollamaUrl).toBe('http://custom:1234');
    expect(custom.config.ollamaModel).toBe('custom-model');
    expect(custom.config.maxResults).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// matchesContract
// ---------------------------------------------------------------------------

describe('matchesContract', () => {
  test('returns true when search term matches contract text', () => {
    const contract = { title: 'Recording Deal', terms: 'royalty rate of 15%' };
    const searchStructure = { searchTerms: ['royalty'], clauseTypes: [] };
    expect(nlp.matchesContract(contract, searchStructure)).toBe(true);
  });

  test('returns false when no terms match', () => {
    const contract = { title: 'Simple NDA', terms: 'non-disclosure' };
    const searchStructure = { searchTerms: ['royalty'], clauseTypes: [] };
    expect(nlp.matchesContract(contract, searchStructure)).toBe(false);
  });

  test('returns true when clause type matches contractType field', () => {
    const contract = { contractType: 'recording', title: 'Deal' };
    const searchStructure = { searchTerms: [], clauseTypes: ['recording'] };
    expect(nlp.matchesContract(contract, searchStructure)).toBe(true);
  });

  test('returns true when searchTerms is empty (matches all)', () => {
    const contract = { title: 'Anything' };
    const searchStructure = { searchTerms: [], clauseTypes: [] };
    expect(nlp.matchesContract(contract, searchStructure)).toBe(true);
  });

  test('matching is case-insensitive', () => {
    const contract = { title: 'ROYALTY DEAL' };
    const searchStructure = { searchTerms: ['royalty'], clauseTypes: [] };
    expect(nlp.matchesContract(contract, searchStructure)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// findContext
// ---------------------------------------------------------------------------

describe('findContext', () => {
  test('returns text around the keyword', () => {
    const text = 'This contract grants rights in perpetuity to the label.';
    const context = nlp.findContext(text, 'perpetuity', 10);
    expect(context).toContain('perpetuity');
    expect(context.length).toBeLessThanOrEqual(text.length);
  });

  test('returns empty string when keyword is not found', () => {
    const text = 'A simple contract.';
    expect(nlp.findContext(text, 'missing')).toBe('');
  });

  test('handles keyword at the beginning of text', () => {
    const text = 'perpetuity is granted in this agreement.';
    const context = nlp.findContext(text, 'perpetuity', 5);
    expect(context).toContain('perpetuity');
  });

  test('handles keyword at the end of text', () => {
    const text = 'Rights are granted in perpetuity';
    const context = nlp.findContext(text, 'perpetuity', 5);
    expect(context).toContain('perpetuity');
  });
});

// ---------------------------------------------------------------------------
// getRecommendation
// ---------------------------------------------------------------------------

describe('getRecommendation', () => {
  test('returns specific recommendation for perpetuity', () => {
    const rec = nlp.getRecommendation('perpetuity');
    expect(rec).toContain('limiting');
  });

  test('returns specific recommendation for workForHire', () => {
    const rec = nlp.getRecommendation('workForHire');
    expect(rec).toContain('fair compensation');
  });

  test('returns specific recommendation for broadLicense', () => {
    const rec = nlp.getRecommendation('broadLicense');
    expect(rec).toContain('Limit');
  });

  test('returns specific recommendation for unfairDeductions', () => {
    const rec = nlp.getRecommendation('unfairDeductions');
    expect(rec).toContain('deduction');
  });

  test('returns generic recommendation for unknown type', () => {
    const rec = nlp.getRecommendation('unknownType');
    expect(rec).toContain('Review clause');
  });
});

// ---------------------------------------------------------------------------
// getTemplates
// ---------------------------------------------------------------------------

describe('getTemplates', () => {
  test('returns empty array initially', () => {
    expect(nlp.getTemplates()).toEqual([]);
  });

  test('returns stored templates after setting', () => {
    nlp.templates.set('test-template', {
      contractType: 'recording',
      template: 'content',
      createdAt: new Date(),
    });
    const templates = nlp.getTemplates();
    expect(templates).toHaveLength(1);
    expect(templates[0][0]).toBe('test-template');
    expect(templates[0][1].contractType).toBe('recording');
  });
});

// ---------------------------------------------------------------------------
// detectRedFlags (keyword-based detection, mock AI path)
// ---------------------------------------------------------------------------

describe('detectRedFlags', () => {
  beforeEach(() => {
    // Mock AI to return empty additional flags
    axios.post.mockResolvedValue({
      data: { message: { content: '{"additionalFlags": []}' } },
    });
  });

  test('detects perpetuity keyword', async () => {
    const text = 'Rights are granted in perpetuity to the label.';
    const flags = await nlp.detectRedFlags(text);
    const perpetuityFlag = flags.find((f) => f.type === 'perpetuity');
    expect(perpetuityFlag).toBeDefined();
    expect(perpetuityFlag.severity).toBe('high');
    expect(perpetuityFlag.detectedKeyword).toContain('perpetuity');
  });

  test('detects work for hire keyword', async () => {
    const text = 'This is a work for hire arrangement.';
    const flags = await nlp.detectRedFlags(text);
    const wfh = flags.find((f) => f.type === 'workForHire');
    expect(wfh).toBeDefined();
    expect(wfh.severity).toBe('medium');
  });

  test('detects broad license keywords', async () => {
    const text = 'License covers all media now known or hereafter devised.';
    const flags = await nlp.detectRedFlags(text);
    const broad = flags.find((f) => f.type === 'broadLicense');
    expect(broad).toBeDefined();
  });

  test('detects unfair deductions', async () => {
    const text = 'A 20% packaging deduction will be applied to all revenue.';
    const flags = await nlp.detectRedFlags(text);
    const deduction = flags.find((f) => f.type === 'unfairDeductions');
    expect(deduction).toBeDefined();
  });

  test('returns no flags for clean contract text', async () => {
    const text = 'This is a simple agreement with fair terms and reasonable conditions.';
    const flags = await nlp.detectRedFlags(text);
    expect(flags).toHaveLength(0);
  });

  test('sorts flags by severity (critical > high > medium > low)', async () => {
    const text = 'This perpetual license covers all media with packaging deduction.';
    const flags = await nlp.detectRedFlags(text);
    for (let i = 1; i < flags.length; i++) {
      const sevOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      expect(sevOrder[flags[i - 1].severity]).toBeLessThanOrEqual(
        sevOrder[flags[i].severity]
      );
    }
  });

  test('emits redFlagsDetected event', async () => {
    const listener = jest.fn();
    nlp.on('redFlagsDetected', listener);
    const text = 'Rights granted in perpetuity.';
    await nlp.detectRedFlags(text);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0]).toBeInstanceOf(Array);
  });
});

// ---------------------------------------------------------------------------
// callOllama
// ---------------------------------------------------------------------------

describe('callOllama', () => {
  test('sends correct payload to Ollama API', async () => {
    axios.post.mockResolvedValue({
      data: { message: { content: 'AI response' } },
    });
    const result = await nlp.callOllama('test prompt', { temperature: 0.5 });
    expect(result).toBe('AI response');
    expect(axios.post).toHaveBeenCalledWith(
      'http://fake:11434/api/chat',
      expect.objectContaining({
        model: nlp.config.ollamaModel,
        stream: false,
      }),
      expect.objectContaining({ timeout: nlp.config.timeout })
    );
  });

  test('throws on API error', async () => {
    axios.post.mockRejectedValue(new Error('Connection refused'));
    await expect(nlp.callOllama('prompt')).rejects.toThrow('Failed to process with local AI');
  });
});
