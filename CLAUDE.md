# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is an AEM Edge Delivery Services (EDS) site based on the AEM Block Collection template, modified for **DA (Document Authoring)** as the content source. Content lives in DA (`fstab.yaml` points to `https://content.da.live/ericvangeem/evgdev/`), and pages are rendered by the EDS scripts in this repo against that markup.

## Commands

```bash
npm install               # install dependencies

npm run lint:js           # ESLint (airbnb-base config, see .eslintrc.js)
npm run lint:css          # Stylelint (blocks/**/*.css, styles/*.css)
npm run lint              # both linters

npm run build:json        # rebuild all generated component JSON (below)
npm run build:json:models
npm run build:json:definitions
npm run build:json:filters

aem up                    # local dev server (requires: npm i -g @adobe/aem-cli)
```

There is no test suite configured in this repo.

### Generated JSON files — do not hand-edit

`component-models.json`, `component-definition.json`, and `component-filters.json` at the repo root are **build output**, merged from partial `_*.json` files (in `models/` and each block's `_{blockname}.json`) via `merge-json-cli`. Edit the `_*.json` sources instead and run `npm run build:json`.

A Husky pre-commit hook (`.husky/pre-commit.mjs`) already detects staged `_*.json` partials, runs `npm run build:json` automatically, and re-stages the results — so the generated files stay in sync on commit even if you forget to build manually.

## Architecture

### Page load lifecycle (`scripts/scripts.js` + `scripts/aem.js`)

EDS pages boot through a three-phase loader, kicked off by `loadPage()` in `scripts/scripts.js`:

1. **`loadEager`** — sets `lang`, decorates the template/theme, decorates `main` (buttons, icons, auto-blocks, sections, blocks, links), then loads and waits on the first section only (to get to LCP fast).
2. **`loadLazy`** — loads all remaining sections, header, footer, lazy CSS, and fonts.
3. **`loadDelayed`** — imports `scripts/delayed.js` after a 3s timeout for anything non-critical.

`decorateMain` in `scripts.js` is the key extension point for page-wide DOM transforms (auto-blocking, link rewriting, external link enhancement, etc.) — most cross-block behavior belongs there rather than in an individual block.

### Blocks

Each block under `blocks/{name}/` is self-contained:
- `{name}.js` — exports a `decorate(block)` function, invoked by `decorateBlocks` (`scripts/aem.js`). Import shared utilities from `../../scripts/aem.js`.
- `{name}.css` — scoped styling.
- `_{name}.json` — **do not add this for new blocks.** Older blocks (e.g. `hero`, `cards`) have one; it's the Universal Editor authoring definition/model, merged into the root `component-*.json` files at build time. This project doesn't support Universal Editor, so new blocks (e.g. `product-details`) intentionally omit it.

### Templates

`templates/{name}/` (currently `blog`, `blog-landing`) provide page-type-specific behavior layered on top of the normal block pipeline. `decorateTemplates` in `scripts.js` reads the `template` page metadata and dynamically imports the matching `templates/{name}/{name}.js` + `.css` only when that template is active.

### DA integration

- `fstab.yaml` maps the EDS mountpoint to the DA content source.
- At the bottom of `scripts/scripts.js`, `?dapreview` on the URL loads `da.live`'s live-preview script and re-runs `loadPage` on content changes (this is what makes in-browser DA authoring preview work without a full reload). `?daexperiment` loads DA's experimentation plugin. `NX_ORIGIN` switches between `da.live` and a local DA dev server (`?nx=local`) for testing DA-side plugin changes against this site.
- `scripts/sidekick.js` is lazy-loaded only after the `aem-sidekick` element exists or fires `sidekick-ready`, wiring up the AEM Sidekick extension.

### JSON2HTML product pages

`json2html/` contains a Mustache template (`product-detail.html`) and service config (`config.json`) for Adobe's json2html worker, which renders individual product pages (`/products/product-detail/{sku}`) server-side from the published `/products/data.json` sheet, filtered by matching `path`. The template is a full EDS page document (doctype/head/body, not a bare fragment) emitting the `product-details` block markup plus per-field `<meta>` tags and a Schema.org `Product` JSON-LD block. The exact request-routing/wiring mechanism (how `aem.live` forwards matching requests to the worker) hasn't been fully confirmed for this project — see the `json2html` config docs at aem.live before assuming it works like a live proxy.

### Content indexing

`helix-query.yaml` (repo root) defines a `products` index over `/products/product-detail/**`, published to `/products/query-index.json`, pulling from the same `<meta>` tags the json2html template emits. Whether this file alone is sufficient for a DA-sourced project (vs. the GDrive/SharePoint-oriented Index Admin Tool + `raw_index` sheet flow described in aem.live's indexing docs) hasn't been verified yet.

## Tools

`tools/generate-products.js` generates seeded, repeatable sample product CSV data (used for prototyping product-detail-style content) at `sample-data/products.csv`, including a `sku`-seeded Picsum `image_url` column: `node tools/generate-products.js [rowCount] [outputPath] [seed]`.

**Important:** this CSV is a local fixture only. The live `/products/data.json` is a DA-authored sheet — regenerating the CSV does **not** update it. Changing row count or columns requires re-importing/republishing the sheet in DA separately.
