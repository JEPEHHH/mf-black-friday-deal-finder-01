# Bargain Beacon

A static Black Friday 2026 deal finder. Seventeen checked deals, each with its
product, store, sale price, usual price, discount, check time, named source and
an honest signal of what the source said about the price.

## Run it

    node main.ts                      # writes /output (needs permission there)
    MAKEFUN_OUTPUT_DIR=out node main.ts   # local run

`main.ts` copies `app/` and `screenshots/` into the output folder and writes
`dossier.json` with make.fun's vendored library. Node 22, standard library only,
no network, no build step.

## The site

Open `app/index.html` in a browser, or serve `app/` as the web root. All code,
styles and deal data are local files; store links open a search for the exact
product at that store. Search, category, store and discount filters plus sorting
all work in the browser, on desktop and on a phone.

## Where the deals came from

Reviewed's "20 best Black Friday deals of 2026" roundup, published 27 November
2026. Prices, usual prices and savings are the roundup's numbers; each deal
names the source and the time it was read. Price checks are a snapshot, not a
live feed — verify at the store before buying.
