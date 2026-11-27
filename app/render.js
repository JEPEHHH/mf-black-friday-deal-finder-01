// Renders the filtered deals into the page. Builds DOM nodes with textContent,
// so deal text can never be read as HTML, and every store link opens its own search.

import { CHECKED_AT, SOURCE_NAME, SOURCE_URL } from './data.js';
import { scoreFor, money } from './filter.js';

var signalText = {
  'low-year': 'Low of the year',
  'first-low': 'First time this low',
  'rare': 'Rare discount',
  'routine': 'Solid cut, no low claim'
};

function element(tag, className, text) {
  var node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function cardFor(deal) {
  var card = element('article', 'deal');

  var top = element('div', 'deal-top');
  top.appendChild(element('span', 'category', deal.category));
  top.appendChild(element('span', 'badge badge-' + deal.signal, signalText[deal.signal]));
  card.appendChild(top);

  var name = element('h3', 'deal-name', deal.product);
  card.appendChild(name);

  var storeLine = element('p', 'store-line');
  storeLine.appendChild(element('span', 'store', deal.store));
  card.appendChild(storeLine);

  var prices = element('div', 'prices');
  var now = element('span', 'now', money(deal.sale));
  var was = element('span', 'was', money(deal.usual));
  var off = element('span', 'off', '-' + deal.discount + '%');
  prices.appendChild(now);
  prices.appendChild(was);
  prices.appendChild(off);
  card.appendChild(prices);

  var scoreLine = element('p', 'score-line');
  scoreLine.appendChild(element('span', 'score-label', 'Deal score '));
  scoreLine.appendChild(element('span', 'score-value', String(scoreFor(deal)) + '/100'));
  card.appendChild(scoreLine);

  card.appendChild(element('p', 'note', deal.note));

  var meta = element('p', 'meta');
  meta.appendChild(document.createTextNode('Checked ' + CHECKED_AT + ' · Source: '));
  var src = element('a', '', SOURCE_NAME);
  src.href = SOURCE_URL;
  src.target = '_blank';
  src.rel = 'noopener noreferrer';
  meta.appendChild(src);
  card.appendChild(meta);

  var actions = element('div', 'actions');
  var link = element('a', 'store-link', 'Find at ' + deal.store + ' ↗');
  link.href = deal.search;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  actions.appendChild(link);
  card.appendChild(actions);

  return card;
}

export function renderDeals(rows, mount, countNode) {
  mount.replaceChildren();
  countNode.textContent = rows.length + (rows.length === 1 ? ' deal' : ' deals') + ' shown';
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
