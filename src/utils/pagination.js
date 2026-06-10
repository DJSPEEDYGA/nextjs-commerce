/**
 * Shared pagination utilities.
 *
 * Extracts the repeated page / limit / skip calculation and the
 * `pagination` response envelope that appears in every list endpoint.
 */

'use strict';

/**
 * Parse page & limit from an Express query object and return the
 * derived skip value.
 *
 * @param {object} query - `req.query`
 * @param {{ defaultLimit?: number }} [opts]
 * @returns {{ page: number, limit: number, skip: number }}
 */
function parsePagination(query, opts = {}) {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || (opts.defaultLimit ?? 10);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/**
 * Build the standard pagination envelope returned alongside list data.
 *
 * @param {number} total  - total document count
 * @param {{ page: number, limit: number }} pagination
 * @returns {{ page: number, limit: number, total: number, pages: number }}
 */
function paginationMeta(total, { page, limit }) {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
}

module.exports = { parsePagination, paginationMeta };
