// Wires the controls to the filter and render modules. No framework, no build step.

import { categories, stores, applyFilters } from './filter.js';
import { renderDeals } from './render.js';
import { CHECKED_AT, SOURCE_URL, SOURCE_NAME } from './data.js';

var q = document.getElementById('q');
var category = document.getElementById('category');
var store = document.getElementById('store');
var discount = document.getElementById('discount');
var sort = document.getElementById('sort');
var mount = document.getElementById('results');
var count = document.getElementById('count');

function fill(select, values) {
  values.forEach(function (value) {
    var option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

fill(category, categories);
fill(store, stores);

function refresh() {
  var rows = applyFilters(q.value, category.value, store.value, discount.value, sort.value);
  renderDeals(rows, mount, count);
}

[q, category, store, discount, sort].forEach(function (input) {
  input.addEventListener('input', refresh);
  input.addEventListener('change', refresh);
});

document.getElementById('reset').addEventListener('click', function () {
  q.value = '';
  category.value = '';
  store.value = '';
  discount.value = '';
  sort.value = 'score';
  refresh();
});

document.getElementById('checked-at').textContent = CHECKED_AT;
var source = document.getElementById('source-link');
source.href = SOURCE_URL;
source.textContent = SOURCE_NAME;

refresh();
