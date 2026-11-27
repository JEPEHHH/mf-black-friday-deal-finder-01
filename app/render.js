// Renders the filtered deals into the page. Builds DOM nodes with textContent,
// so deal text can never be read as HTML, and every store link opens its own search.
//
// Product shots are drawn, not fetched: each category owns a small inline SVG
// silhouette over a category gradient, and a product keyword swaps in a closer
// shape (a vacuum instead of an armchair). Nothing here can 404.

import { CHECKED_AT, SOURCE_NAME, SOURCE_URL } from './data.js';
import { scoreFor, money } from './filter.js';

var SVG_NS = 'http://www.w3.org/2000/svg';

var signalText = {
  'low-year': 'Low of the year',
  'first-low': 'First time this low',
  'rare': 'Rare discount',
  'routine': 'Solid cut, no low claim'
};

// One short phrase per signal, for the line under the score meter.
var signalShort = {
  'low-year': 'matches the year low',
  'first-low': 'never been this low',
  'rare': 'rarely discounted',
  'routine': 'solid cut only'
};

// How each store is asked to be opened. Wording only; the href is the deal's own.
var storeVerb = {
  'Amazon': 'Check price at',
  'Target': 'See it at',
  'Best Buy': 'Open',
  "Macy's": 'View it at',
  'Nordstrom': 'Go to',
  "Kohl's": 'Shop at',
  'Ulta': 'View at',
  'Bissell': 'Buy at',
  'Logitech G': 'Buy direct',
  'Our Place': 'Go to',
  'Béis': 'Shop at',
  'Loftie': 'Shop at'
};

// Short store codes for the button tag, so the badge reads at a glance.
var storeCode = {
  'Amazon': 'AMZ',
  'Target': 'TGT',
  'Best Buy': 'BBY',
  "Macy's": 'MACY',
  'Nordstrom': 'ND',
  "Kohl's": 'K',
  'Ulta': 'ULT',
  'Bissell': 'BIS',
  'Logitech G': 'LOG',
  'Our Place': 'OP',
  'Béis': 'BEIS',
  'Loftie': 'LOF'
};

function element(tag, className, text) {
  var node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function slug(text) {
  return String(text).toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function clockOf(stamp) {
  var parts = String(stamp).split(' ');
  return (parts[1] || '') + ' ' + (parts[2] || 'UTC');
}

// Savings are a whole-dollar figure; group it so four digits stay readable.
function grouped(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

/* ---------- product art -------------------------------------------------
   Shapes live on a 320x180 stage. `ink` is the silhouette, `hi` a highlight,
   `line` a stroked arc. Each entry is [tag, attributes]. */

var artByCategory = {
  'Home': [
    ['rect', { x: 112, y: 52, width: 96, height: 58, rx: 16, class: 'ink' }],
    ['rect', { x: 100, y: 100, width: 120, height: 30, rx: 12, class: 'ink' }],
    ['rect', { x: 92, y: 78, width: 20, height: 56, rx: 10, class: 'ink' }],
    ['rect', { x: 208, y: 78, width: 20, height: 56, rx: 10, class: 'ink' }],
    ['rect', { x: 112, y: 130, width: 10, height: 18, rx: 4, class: 'ink' }],
    ['rect', { x: 198, y: 130, width: 10, height: 18, rx: 4, class: 'ink' }],
    ['rect', { x: 126, y: 66, width: 68, height: 8, rx: 4, class: 'hi' }]
  ],
  'Kitchen': [
    ['rect', { x: 126, y: 32, width: 68, height: 12, rx: 6, class: 'ink' }],
    ['path', { d: 'M132 48h56l-8 66h-40z', class: 'ink' }],
    ['rect', { x: 138, y: 114, width: 44, height: 30, rx: 7, class: 'ink' }],
    ['circle', { cx: 160, cy: 129, r: 6, class: 'hi' }],
    ['path', { d: 'M142 58h12l-3 44h-6z', class: 'hi' }]
  ],
  'Electronics': [
    ['path', { d: 'M96 106v-12a64 64 0 0 1 128 0v12h-16a48 48 0 0 0-96 0z', class: 'ink' }],
    ['rect', { x: 92, y: 100, width: 26, height: 54, rx: 13, class: 'ink' }],
    ['rect', { x: 202, y: 100, width: 26, height: 54, rx: 13, class: 'ink' }],
    ['rect', { x: 100, y: 112, width: 10, height: 30, rx: 5, class: 'hi' }]
  ],
  'Smart home': [
    ['rect', { x: 118, y: 54, width: 84, height: 84, rx: 18, class: 'ink' }],
    ['rect', { x: 130, y: 66, width: 60, height: 46, rx: 8, class: 'hi' }],
    ['circle', { cx: 160, cy: 122, r: 6, class: 'hi' }],
    ['rect', { x: 136, y: 138, width: 12, height: 8, rx: 4, class: 'ink' }],
    ['rect', { x: 172, y: 138, width: 12, height: 8, rx: 4, class: 'ink' }]
  ],
  'Wearables': [
    ['circle', { cx: 160, cy: 92, r: 44, class: 'line' }],
    ['rect', { x: 150, y: 38, width: 20, height: 12, rx: 5, class: 'ink' }],
    ['circle', { cx: 160, cy: 92, r: 8, class: 'hi' }]
  ],
  'Beauty': [
    ['rect', { x: 146, y: 96, width: 28, height: 58, rx: 13, class: 'ink' }],
    ['rect', { x: 150, y: 46, width: 20, height: 54, rx: 10, class: 'ink' }],
    ['rect', { x: 152, y: 60, width: 6, height: 34, rx: 3, class: 'hi' }],
    ['rect', { x: 140, y: 128, width: 40, height: 8, rx: 4, class: 'hi' }]
  ],
  'Travel': [
    ['rect', { x: 140, y: 44, width: 40, height: 16, rx: 4, class: 'ink' }],
    ['rect', { x: 108, y: 58, width: 104, height: 82, rx: 10, class: 'ink' }],
    ['rect', { x: 120, y: 70, width: 80, height: 34, rx: 6, class: 'hi' }],
    ['rect', { x: 146, y: 82, width: 28, height: 8, rx: 4, class: 'ink' }],
    ['circle', { cx: 126, cy: 146, r: 8, class: 'ink' }],
    ['circle', { cx: 194, cy: 146, r: 8, class: 'ink' }]
  ]
};

// Product words that beat the category shape.
var artByWord = [
  [/vacuum/i, [
    ['rect', { x: 148, y: 30, width: 24, height: 12, rx: 5, class: 'ink' }],
    ['rect', { x: 156, y: 40, width: 9, height: 66, class: 'ink' }],
    ['rect', { x: 138, y: 100, width: 44, height: 42, rx: 12, class: 'ink' }],
    ['rect', { x: 112, y: 140, width: 96, height: 14, rx: 7, class: 'ink' }],
    ['circle', { cx: 168, cy: 120, r: 9, class: 'hi' }]
  ]],
  [/carpet cleaner|little green/i, [
    ['rect', { x: 150, y: 52, width: 12, height: 30, rx: 6, class: 'ink' }],
    ['rect', { x: 126, y: 78, width: 70, height: 54, rx: 14, class: 'ink' }],
    ['rect', { x: 118, y: 132, width: 86, height: 14, rx: 7, class: 'ink' }],
    ['circle', { cx: 148, cy: 100, r: 8, class: 'hi' }]
  ]],
  [/air fryer/i, [
    ['path', { d: 'M122 56h76a18 18 0 0 1 18 18v58a10 10 0 0 1-10 10h-92a10 10 0 0 1-10-10V74a18 18 0 0 1 18-18z', class: 'ink' }],
    ['rect', { x: 138, y: 72, width: 44, height: 9, rx: 4, class: 'hi' }],
    ['rect', { x: 130, y: 96, width: 60, height: 28, rx: 8, class: 'hi' }],
    ['rect', { x: 126, y: 142, width: 12, height: 8, rx: 4, class: 'ink' }],
    ['rect', { x: 182, y: 142, width: 12, height: 8, rx: 4, class: 'ink' }]
  ]],
  [/pan|skillet/i, [
    ['circle', { cx: 146, cy: 96, r: 44, class: 'ink' }],
    ['circle', { cx: 146, cy: 96, r: 30, class: 'hi' }],
    ['rect', { x: 188, y: 90, width: 62, height: 12, rx: 6, class: 'ink' }]
  ]],
  [/instant pot|pressure|slow cook/i, [
    ['rect', { x: 120, y: 78, width: 80, height: 58, rx: 14, class: 'ink' }],
    ['rect', { x: 112, y: 66, width: 96, height: 14, rx: 7, class: 'ink' }],
    ['rect', { x: 152, y: 52, width: 16, height: 14, rx: 6, class: 'ink' }],
    ['rect', { x: 134, y: 94, width: 52, height: 10, rx: 5, class: 'hi' }]
  ]],
  [/ring/i, [
    ['circle', { cx: 160, cy: 96, r: 42, class: 'line' }],
    ['rect', { x: 150, y: 44, width: 20, height: 10, rx: 4, class: 'ink' }],
    ['rect', { x: 150, y: 138, width: 20, height: 10, rx: 4, class: 'ink' }]
  ]],
  [/mask/i, [
    ['path', { d: 'M120 58h80a20 20 0 0 1 20 20v24a36 36 0 0 1-36 36h-48a36 36 0 0 1-36-36V78a20 20 0 0 1 20-20z', class: 'ink' }],
    ['rect', { x: 132, y: 86, width: 26, height: 12, rx: 6, class: 'hi' }],
    ['rect', { x: 164, y: 86, width: 26, height: 12, rx: 6, class: 'hi' }],
    ['rect', { x: 146, y: 114, width: 30, height: 6, rx: 3, class: 'hi' }]
  ]],
  [/mouse/i, [
    ['path', { d: 'M160 40c-25 0-39 22-39 52 0 26 15 44 39 44s39-18 39-44c0-30-14-52-39-52z', class: 'ink' }],
    ['rect', { x: 156, y: 52, width: 8, height: 20, rx: 4, class: 'hi' }]
  ]],
  [/glasses|xreal/i, [
    ['rect', { x: 92, y: 78, width: 58, height: 40, rx: 14, class: 'ink' }],
    ['rect', { x: 170, y: 78, width: 58, height: 40, rx: 14, class: 'ink' }],
    ['rect', { x: 150, y: 90, width: 20, height: 7, rx: 3, class: 'ink' }],
    ['rect', { x: 76, y: 86, width: 16, height: 7, rx: 3, class: 'ink' }],
    ['rect', { x: 228, y: 86, width: 16, height: 7, rx: 3, class: 'ink' }],
    ['rect', { x: 100, y: 86, width: 20, height: 8, rx: 4, class: 'hi' }]
  ]],
  [/carry-on|roller|suitcase/i, [
    ['rect', { x: 140, y: 44, width: 40, height: 16, rx: 4, class: 'ink' }],
    ['rect', { x: 108, y: 58, width: 104, height: 82, rx: 10, class: 'ink' }],
    ['rect', { x: 120, y: 70, width: 80, height: 34, rx: 6, class: 'hi' }],
    ['rect', { x: 146, y: 82, width: 28, height: 8, rx: 4, class: 'ink' }],
    ['circle', { cx: 126, cy: 146, r: 8, class: 'ink' }],
    ['circle', { cx: 194, cy: 146, r: 8, class: 'ink' }]
  ]],
  [/clock|alarm/i, [
    ['circle', { cx: 160, cy: 94, r: 46, class: 'ink' }],
    ['circle', { cx: 160, cy: 94, r: 34, class: 'hi' }],
    ['rect', { x: 157, y: 66, width: 6, height: 30, rx: 3, class: 'ink' }],
    ['rect', { x: 157, y: 90, width: 24, height: 6, rx: 3, class: 'ink' }]
  ]],
  [/feeder|bird/i, [
    ['path', { d: 'M108 74l52-34 52 34z', class: 'ink' }],
    ['rect', { x: 120, y: 74, width: 80, height: 58, rx: 10, class: 'ink' }],
    ['circle', { cx: 160, cy: 100, r: 14, class: 'hi' }]
  ]],
  [/blanket|throw/i, [
    ['path', { d: 'M110 76q50 -22 100 0v54q-50 22 -100 0z', class: 'ink' }],
    ['path', { d: 'M126 84q34 -14 68 0v16q-34 14 -68 0z', class: 'hi' }],
    ['rect', { x: 110, y: 132, width: 100, height: 8, rx: 4, class: 'ink' }]
  ]],
  [/calendar/i, [
    ['rect', { x: 114, y: 58, width: 92, height: 82, rx: 12, class: 'ink' }],
    ['rect', { x: 114, y: 58, width: 92, height: 18, rx: 9, class: 'hi' }],
    ['circle', { cx: 138, cy: 94, r: 6, class: 'hi' }],
    ['circle', { cx: 160, cy: 94, r: 6, class: 'hi' }],
    ['circle', { cx: 182, cy: 94, r: 6, class: 'hi' }],
    ['circle', { cx: 138, cy: 116, r: 6, class: 'hi' }]
  ]],
  [/tv cube|fire tv|stream/i, [
    ['rect', { x: 124, y: 54, width: 72, height: 72, rx: 16, class: 'ink' }],
    ['circle', { cx: 160, cy: 90, r: 16, class: 'hi' }],
    ['rect', { x: 136, y: 136, width: 48, height: 8, rx: 4, class: 'ink' }]
  ]]
];

function artFor(deal) {
  var shapes = null;
  for (var i = 0; i < artByWord.length; i += 1) {
    if (artByWord[i][0].test(deal.product)) { shapes = artByWord[i][1]; break; }
  }
  if (!shapes) shapes = artByCategory[deal.category] || artByCategory['Home'];

  var svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 320 180');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', deal.category + ' product illustration');

  shapes.forEach(function (shape) {
    var node = document.createElementNS(SVG_NS, shape[0]);
    var attrs = shape[1];
    Object.keys(attrs).forEach(function (key) {
      node.setAttribute(key, String(attrs[key]));
    });
    svg.appendChild(node);
  });
  return svg;
}

function thumbFor(deal) {
  var thumb = element('div', 'thumb art-' + (slug(deal.category) || 'general'));
  thumb.appendChild(artFor(deal));
  thumb.appendChild(element('span', 'badge badge-' + deal.signal, signalText[deal.signal]));
  return thumb;
}

function cardFor(deal) {
  var card = element('article', 'deal');
  card.appendChild(thumbFor(deal));

  var body = element('div', 'body');

  var meta = element('div', 'deal-meta');
  meta.appendChild(element('span', 'category', deal.category));
  meta.appendChild(element('span', 'dot', '·'));
  meta.appendChild(element('span', 'store', deal.store));
  body.appendChild(meta);

  body.appendChild(element('h3', 'deal-name', deal.product));

  var prices = element('div', 'prices');
  prices.appendChild(element('span', 'now', money(deal.sale)));
  prices.appendChild(element('span', 'was', money(deal.usual)));
  prices.appendChild(element('span', 'off', '-' + deal.discount + '%'));
  body.appendChild(prices);

  var score = scoreFor(deal);
  var scoreBox = element('div', 'score');
  var meter = element('div', 'meter');
  var fill = element('i');
  fill.style.width = Math.max(6, Math.min(100, score)) + '%';
  meter.appendChild(fill);
  scoreBox.appendChild(meter);
  var scoreLine = element('p', 'score-line');
  scoreLine.appendChild(element('strong', '', String(score) + '/100'));
  scoreLine.appendChild(document.createTextNode(' · ' + signalShort[deal.signal]));
  scoreBox.appendChild(scoreLine);
  body.appendChild(scoreBox);

  body.appendChild(element('p', 'note', deal.note));

  var actions = element('div', 'actions');
  var link = element('a', 'store-link');
  link.dataset.store = slug(deal.store);
  link.appendChild(element('span', 'store-tag', storeCode[deal.store] || deal.store.slice(0, 3).toUpperCase()));
  link.appendChild(document.createTextNode((storeVerb[deal.store] || 'Find it at') + ' ' + deal.store));
  link.appendChild(element('span', 'arrow', '↗'));
  link.appendChild(element('span', 'sr-only', ' (opens ' + deal.store + ' in a new tab)'));
  link.href = deal.search;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  actions.appendChild(link);
  actions.appendChild(element('span', 'checked', 'dicek ' + clockOf(CHECKED_AT)));
  body.appendChild(actions);

  card.appendChild(body);
  return card;
}

function fillSummary(rows) {
  var countNode = document.getElementById('sum-count');
  var saveNode = document.getElementById('sum-save');
  var checkNode = document.getElementById('sum-check');
  if (!countNode || !saveNode || !checkNode) return;
  var save = rows.reduce(function (sum, deal) { return sum + (deal.usual - deal.sale); }, 0);
  countNode.textContent = String(rows.length);
  saveNode.textContent = grouped(save);
  checkNode.textContent = CHECKED_AT;
}

export function renderDeals(rows, mount, countNode) {
  mount.replaceChildren();
  countNode.textContent = rows.length + (rows.length === 1 ? ' deal' : ' deals') + ' shown · source: ' + SOURCE_NAME;
  fillSummary(rows);

  if (rows.length === 0) {
    var empty = element('div', 'empty');
    empty.appendChild(element('h3', '', 'No deals match those filters'));
    empty.appendChild(element('p', '', 'Try a different category, store or a lower discount.'));
    mount.appendChild(empty);
    return;
  }

  var grid = element('div', 'grid');
  rows.forEach(function (deal) { grid.appendChild(cardFor(deal)); });
  mount.appendChild(grid);
}

// The footer keeps its source line; export the pieces main.js needs.
export { SOURCE_URL, SOURCE_NAME };
