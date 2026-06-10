/**
 * Shared aggregation-result helpers.
 *
 * The same "reduce an array of { key, value } into a summary object"
 * logic is duplicated across the analytics endpoints.
 */

'use strict';

/**
 * Reduce `[{ [keyField]: k, [valueField]: v }, ...]` into `{ k: totalV }`.
 *
 * @param {Array<object>} items
 * @param {string} keyField   – property name for the grouping key
 * @param {string} valueField – property name for the numeric value
 * @returns {object}
 */
function groupBySum(items, keyField, valueField) {
  return items.reduce((acc, item) => {
    const key = item[keyField];
    acc[key] = (acc[key] || 0) + item[valueField];
    return acc;
  }, {});
}

/**
 * Same as `groupBySum` but also tracks a per-key count.
 *
 * @returns {object} – `{ [key]: { count, amount } }`
 */
function groupBySumWithCount(items, keyField, valueField) {
  return items.reduce((acc, item) => {
    const key = item[keyField];
    if (!acc[key]) acc[key] = { count: 0, amount: 0 };
    acc[key].count += 1;
    acc[key].amount += item[valueField];
    return acc;
  }, {});
}

module.exports = { groupBySum, groupBySumWithCount };
