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
var chips = document.getElementById('chips');

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

// Chips are the fast path to a category: same select, one click.
function buildChips() {
  var all = document.createElement('button');
  all.type = 'button';
  all.className = 'chip';
  all.dataset.category = '';
  all.textContent = 'All';
  chips.appendChild(all);

  categories.forEach(function (name) {
    var chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.dataset.category = name;
    chip.textContent = name;
    chips.appendChild(chip);
  });

  chips.addEventListener('click', function (event) {
    var chip = event.target.closest('.chip');
    if (!chip) return;
    category.value = chip.dataset.category;
    refresh();
    document.getElementById('results').scrollIntoView({ block: 'nearest' });
  });
}

function syncChips() {
  chips.querySelectorAll('.chip').forEach(function (chip) {
    chip.setAttribute('aria-pressed', String(chip.dataset.category === category.value));
  });
}

function refresh() {
  var rows = applyFilters(q.value, category.value, store.value, discount.value, sort.value);
  renderDeals(rows, mount, count);
  syncChips();
}

buildChips();

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
