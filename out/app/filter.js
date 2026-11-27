// Pure functions for the finder: filtering, sorting and the deal-score.
// Kept apart from rendering so both can be read on their own.

import { deals } from './data.js';

export const categories = [...new Set(deals.map(function (d) { return d.category; }))].sort();
export const stores = [...new Set(deals.map(function (d) { return d.store; }))].sort();

// A deal's score rewards a real cut and an honest signal from the source.
// It is a shopping hint, not a claim that the price is the lowest ever.
const signalWeight = { 'low-year': 18, 'first-low': 20, 'rare': 14, 'routine': 4 };

export function scoreFor(deal) {
  var cut = Math.min(deal.discount, 70) * 0.9;
  return Math.round(cut + (signalWeight[deal.signal] || 0));
}

export function parseDiscount(raw) {
  if (!raw) return null;
  var n = Number(String(raw).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
}

// Every active filter must match; an empty string means "any".
export function applyFilters(query, category, store, minDiscount, sortKey) {
  var text = String(query || '').trim().toLowerCase();
  var min = parseDiscount(minDiscount);

  var rows = deals.filter(function (d) {
    if (text && (d.product + ' ' + d.store + ' ' + d.category).toLowerCase().indexOf(text) === -1) return false;
    if (category && d.category !== category) return false;
    if (store && d.store !== store) return false;
    if (min !== null && d.discount < min) return false;
    return true;
  });

  var by = sortKey || 'score';
  rows.sort(function (a, b) {
    if (by === 'discount') return b.discount - a.discount || a.product.localeCompare(b.product);
    if (by === 'price') return a.sale - b.sale || a.product.localeCompare(b.product);
    if (by === 'newest') return a.product.localeCompare(b.product);
    return scoreFor(b) - scoreFor(a) || b.discount - a.discount;
  });
  return rows;
}

export function money(n) {
  return '$' + Number(n).toFixed(2);
}
