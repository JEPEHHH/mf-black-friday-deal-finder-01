// Every row below was read from a published deals roundup dated 27 November 2026.
// Sale price, usual price and the saving are the numbers that roundup printed.
// The check time is when this agent read that source. No product, store or price
// here was invented: each row keeps the source it came from so you can re-check it.

export const CHECKED_AT = '2026-11-27 07:15 UTC';
export const SOURCE_NAME = 'Reviewed — 20 best Black Friday deals of 2026';
export const SOURCE_URL = 'https://www.reviewed.com/deals/features/black-friday-2026-best-deals-product-experts';

// signal: what the source itself said about the price, not a guess from us.
//   low-year  = source calls it the lowest price seen this year
//   first-low = source says it has never been this low before
//   rare      = source says real discounts on this item are rare
//   routine   = a solid cut, but the source makes no lowest-ever claim
export const deals = [
  {
    id: 'dyson-v9-motorbar',
    product: 'Dyson V9 Motorbar Cordless Vacuum',
    category: 'Home',
    store: 'Target',
    sale: 269.99,
    usual: 599.99,
    discount: 55,
    signal: 'routine',
    note: 'More than half off. Target Black Friday sale runs through 29 November.',
    search: 'https://www.target.com/s?searchTerm=Dyson+V9+Motorbar+vacuum'
  },
  {
    id: 'skylight-calendar-2',
    product: 'Skylight Calendar 2',
    category: 'Smart home',
    store: 'Amazon',
    sale: 269.99,
    usual: 349.99,
    discount: 23,
    signal: 'low-year',
    note: 'Matches its lowest Amazon price of the year, says the source.',
    search: 'https://www.amazon.com/s?k=Skylight+Calendar+2'
  },
  {
    id: 'oura-ring-5',
    product: 'Oura Ring 5',
    category: 'Wearables',
    store: 'Best Buy',
    sale: 299.00,
    usual: 399.00,
    discount: 25,
    signal: 'first-low',
    note: 'First time the source has seen the Ring 5 this low. Membership costs extra after month one.',
    search: 'https://www.bestbuy.com/site/searchpage.jsp?st=Oura+Ring+5'
  },
  {
    id: 'our-place-titanium-pan',
    product: 'Our Place Titanium Always Pan Pro',
    category: 'Kitchen',
    store: 'Our Place',
    sale: 139.00,
    usual: 179.00,
    discount: 22,
    signal: 'routine',
    note: 'Brand sale on its own site through 30 November; uncoated titanium, metal-utensil safe.',
    search: 'https://www.fromourplace.com/search?q=Titanium+Always+Pan+Pro'
  },
  {
    id: 'ninja-air-fryer-xl',
    product: 'Ninja Air Fryer XL 5.5 qt',
    category: 'Kitchen',
    store: 'Amazon',
    sale: 89.99,
    usual: 179.99,
    discount: 50,
    signal: 'low-year',
    note: 'Matches the lowest price this item sold for in 2026, says the source.',
    search: 'https://www.amazon.com/s?k=Ninja+Air+Fryer+XL+5.5+qt'
  },
  {
    id: 'lenox-spice-village',
    product: 'Lenox Spice Village 24-Piece Jar Collection',
    category: 'Kitchen',
    store: "Macy's",
    sale: 208.99,
    usual: 299.99,
    discount: 30,
    signal: 'rare',
    note: 'Real discounts are rare; Macy\'s calls this its lowest price. One set per customer.',
    search: 'https://www.macys.com/shop/search?keyword=Lenox%20Spice%20Village%2024%20piece'
  },
  {
    id: 'nanoleaf-led-mask',
    product: 'Nanoleaf LED Light Therapy Face Mask',
    category: 'Beauty',
    store: 'Amazon',
    sale: 99.99,
    usual: 249.99,
    discount: 60,
    signal: 'routine',
    note: 'FDA-cleared, seven light modes, rechargeable. Source makes no lowest-ever claim.',
    search: 'https://www.amazon.com/s?k=Nanoleaf+LED+Light+Therapy+Face+Mask'
  },
  {
    id: 'instant-pot-duo-6',
    product: 'Instant Pot Duo 6-Quart',
    category: 'Kitchen',
    store: 'Amazon',
    sale: 59.99,
    usual: 109.99,
    discount: 45,
    signal: 'low-year',
    note: 'Lowest Amazon price of the year, says the source. Pressure cook, slow cook, sauté.',
    search: 'https://www.amazon.com/s?k=Instant+Pot+Duo+6+Quart'
  },
  {
    id: 'bissell-little-green',
    product: 'Bissell Little Green Portable Carpet Cleaner',
    category: 'Home',
    store: 'Bissell',
    sale: 94.99,
    usual: 129.99,
    discount: 27,
    signal: 'routine',
    note: 'Sale price runs through 28 November. For carpet, upholstery and car seats.',
    search: 'https://www.bissell.com/search?q=Little+Green+portable+carpet+cleaner'
  },
  {
    id: 'barefoot-dreams-throw',
    product: 'Barefoot Dreams CozyChic Throw Blanket',
    category: 'Home',
    store: 'Nordstrom',
    sale: 99.99,
    usual: 158.99,
    discount: 37,
    signal: 'routine',
    note: 'Some colours are cheaper than others at Nordstrom; verify the shade you want.',
    search: 'https://www.nordstrom.com/sr?origin=entrypoint&keyword=Barefoot%20Dreams%20CozyChic%20Throw'
  },
  {
    id: 'fire-tv-cube',
    product: 'Amazon Fire TV Cube (3rd gen)',
    category: 'Electronics',
    store: 'Amazon',
    sale: 89.99,
    usual: 199.99,
    discount: 55,
    signal: 'routine',
    note: 'Hands-free streaming box. Source does not claim a price low.',
    search: 'https://www.amazon.com/s?k=Amazon+Fire+TV+Cube+3rd+gen'
  },
  {
    id: 'birdfy-feeder-rookie',
    product: 'Birdfy Feeder Rookie',
    category: 'Smart home',
    store: "Kohl's",
    sale: 79.99,
    usual: 99.99,
    discount: 20,
    signal: 'routine',
    note: 'Camera feeder with free lifetime AI bird identification. Kohl\'s price runs through 28 November.',
    search: 'https://www.kohls.com/search.jsp?search=Birdfy+Feeder+Rookie'
  },
  {
    id: 'beis-carry-on',
    product: 'Béis The Carry-On Roller',
    category: 'Travel',
    store: 'Béis',
    sale: 201.00,
    usual: 268.00,
    discount: 25,
    signal: 'routine',
    note: 'Brand sale through 30 November; discounts vary by colourway.',
    search: 'https://www.travelbeis.com/search?q=The+Carry-On+Roller'
  },
  {
    id: 'loftie-clock',
    product: 'Loftie Clock',
    category: 'Smart home',
    store: 'Loftie',
    sale: 159.99,
    usual: 199.99,
    discount: 20,
    signal: 'routine',
    note: 'Alarm, white noise and wind-down sounds. Brand discount runs through 1 December.',
    search: 'https://www.loftie.com/search?q=Loftie+Clock'
  },
  {
    id: 'dyson-airwrap-id',
    product: 'Dyson Airwrap i.d. Multi-styler (Plum & Copper)',
    category: 'Beauty',
    store: 'Ulta',
    sale: 499.99,
    usual: 649.99,
    discount: 23,
    signal: 'rare',
    note: 'Dyson hair tools rarely go on sale. Limited edition finish with presentation case.',
    search: 'https://www.ulta.com/shop/search?query=Dyson%20Airwrap%20i.d.'
  },
  {
    id: 'logitech-g502-x',
    product: 'Logitech G502 X Wired Gaming Mouse',
    category: 'Electronics',
    store: 'Logitech G',
    sale: 39.99,
    usual: 99.99,
    discount: 60,
    signal: 'routine',
    note: 'Wired version keeps the same shape and programmable buttons. Logitech sale to 30 November.',
    search: 'https://www.logitechg.com/en-us/search.html?q=G502%20X'
  },
  {
    id: 'xreal-one-pro',
    product: 'XREAL One Pro AR Glasses',
    category: 'Electronics',
    store: 'Best Buy',
    sale: 524.99,
    usual: 599.99,
    discount: 13,
    signal: 'routine',
    note: 'Smallest cut on the board — a modest price, not a headline bargain.',
    search: 'https://www.bestbuy.com/site/searchpage.jsp?st=XREAL+One+Pro'
  }
];
