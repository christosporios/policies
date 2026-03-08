# Policy Proposals

A single-page app that renders structured policy proposals from YAML files. Each policy is a self-contained `.policy.yaml` file with budgets, timelines, KPIs, legal references, and sourced statistics — the site turns it into an interactive document.

**Live:** [policies-gamma.vercel.app](https://policies-gamma.vercel.app)

## Getting started

```
git clone https://github.com/christosporios/policies.git
cd policies
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Adding a policy

1. Create a `.policy.yaml` file in `policies/` (see the [schema](#schema) or existing files for reference).
2. Drop a background image in `public/` and set `meta.background_image` in your YAML.
3. The site picks it up automatically — no code changes needed.

A Claude skill file is available at `public/policy-skill.md` to help generate well-structured policies using Claude with Deep Research.

## Build

```
npm run build
```

This runs three steps:
1. `generate-og-image.mjs` — creates per-policy and homepage OG images using `sharp`
2. `vite build` — bundles the app
3. `generate-policy-html.mjs` — creates per-policy `index.html` files with OG meta tags for social sharing

## Project structure

```
policies/
  *.policy.yaml          YAML policy documents
public/
  policy-skill.md        Claude skill file for generating policies
scripts/
  generate-og-image.mjs  OG image generation (sharp)
  generate-policy-html.mjs  Per-policy HTML for social meta tags
src/
  app.jsx                Router (client-side, no library)
  main.jsx               Entry point
  components/
    policy-index.jsx     Card grid index page
    policy-viewer.jsx    Full policy document viewer
    create-page.jsx      "Create your own" explainer
    measure-section.jsx  Accordion section per measure
    budget-table.jsx     Budget breakdown tables
    summary-section.jsx  Cost summary
    references-section.jsx  Cited sources
    ...
  lib/
    policies.js          YAML loading via import.meta.glob
    theme.js             Design tokens
    format.js            Number/currency formatting
    tokens.jsx           Inline stat/ref token resolution
    ref-index.js         Reference index builder
```

## Schema

Each `.policy.yaml` file contains:

| Section | Description |
|---------|-------------|
| `meta` | Title, subtitle, scope, tagline, background image |
| `measures[]` | Context, action, budget, and KPIs per measure |
| `summary` | Aggregated setup + annual costs with breakdowns |
| `timeline[]` | Month-by-month milestones |
| `kpis` | Programme-wide indicators and reporting cadence |
| `references[]` | Cited sources with title, author, year, URL |

## Stack

React, Vite, Framer Motion, js-yaml. No router library — client-side routing via `pushState`. Deployed on Vercel.
