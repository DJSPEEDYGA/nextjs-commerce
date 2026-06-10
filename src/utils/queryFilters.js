/**
 * Shared query-filter builders.
 *
 * Eliminates the repeated date-range and artist-access filter logic
 * scattered across route handlers.
 */

'use strict';

const { AppError } = require('../middleware/errorHandler');

/**
 * Build a MongoDB date-range filter (`$gte` / `$lte`).
 *
 * @param {string|undefined} startDate
 * @param {string|undefined} endDate
 * @returns {object|null} – a filter like `{ $gte: Date, $lte: Date }` or
 *                          `null` when no dates are supplied.
 */
function buildDateRangeFilter(startDate, endDate) {
  if (!startDate && !endDate) return null;
  const filter = {};
  if (startDate) filter.$gte = new Date(startDate);
  if (endDate) filter.$lte = new Date(endDate);
  return filter;
}

/**
 * Restrict a query to the current artist when the caller has the
 * `artist` role, or to an explicit `artistId` query-param otherwise.
 *
 * Mutates `query` in place for convenience.
 *
 * @param {object} query        – Mongo filter being built
 * @param {object} user         – `req.user`
 * @param {object|undefined} artistProfile – `req.artistProfile`
 * @param {string} [fieldName]  – name of the artist field (default `'artist'`)
 * @param {string|undefined} [queryArtist] – explicit artist ID from query-string
 */
function applyArtistFilter(query, user, artistProfile, fieldName = 'artist', queryArtist) {
  if (user.role === 'artist' && artistProfile) {
    query[fieldName] = artistProfile._id;
  } else if (queryArtist) {
    query[fieldName] = queryArtist;
  }
}

/**
 * Verify that an artist owns a specific document.
 * Throws `AppError(403)` when the check fails.
 *
 * @param {object} doc           – the Mongoose document
 * @param {object} user          – `req.user`
 * @param {object|undefined} artistProfile
 * @param {string} resourceLabel – human-readable label for the error message
 */
function enforceArtistOwnership(doc, user, artistProfile, resourceLabel) {
  if (user.role === 'artist' && artistProfile) {
    const docArtistId = doc.artist?._id ?? doc.artist;
    if (docArtistId.toString() !== artistProfile._id.toString()) {
      throw new AppError(`Not authorized to access this ${resourceLabel}`, 403);
    }
  }
}

module.exports = {
  buildDateRangeFilter,
  applyArtistFilter,
  enforceArtistOwnership,
};
