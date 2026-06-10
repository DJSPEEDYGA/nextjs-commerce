/**
 * Shared route-handler helpers.
 *
 * - `findByIdOr404` removes the repeated findById → 404 check.
 * - `hostingerHandler` wraps the identical try/catch in every Hostinger route.
 */

'use strict';

const { AppError } = require('../middleware/errorHandler');

/**
 * Look up a Mongoose document by ID, throwing a 404 `AppError` when it
 * does not exist.
 *
 * @param {import('mongoose').Model} Model
 * @param {string} id
 * @param {string} label – human-readable model name for the error message
 * @param {Array<string|object>} [populateOpts] – optional `.populate()` args
 * @returns {Promise<import('mongoose').Document>}
 */
async function findByIdOr404(Model, id, label, populateOpts = []) {
  let query = Model.findById(id);
  for (const p of populateOpts) {
    query = query.populate(p);
  }
  const doc = await query;
  if (!doc) {
    throw new AppError(`${label} not found`, 404);
  }
  return doc;
}

/**
 * Create an Express handler that delegates to a Hostinger-service method and
 * returns the result as JSON, with a standardised 500 catch block.
 *
 * @param {Function} serviceFn    – bound service method (receives `req`)
 * @param {string}   errorMessage – user-facing error prefix
 * @returns {import('express').RequestHandler}
 */
function hostingerHandler(serviceFn, errorMessage) {
  return async (req, res) => {
    try {
      const result = await serviceFn(req);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: errorMessage,
        details: error.message,
      });
    }
  };
}

module.exports = { findByIdOr404, hostingerHandler };
