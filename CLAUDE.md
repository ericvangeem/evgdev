# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is an AEM Edge Delivery Services project based on the AEM Block Collection. The project follows a modular block-based architecture:

- **Blocks**: Reusable components in `/blocks/` directory, each with CSS, JS, and JSON configuration files
- **Scripts**: Core functionality in `/scripts/` with `aem.js` providing the main AEM utilities and `scripts.js` for site-specific logic
- **Styles**: Global styles in `/styles/` directory
- **Templates**: Page templates in `/templates/` directory
- **Tools**: Development and configuration tools in `/tools/`

## Key Files

- `scripts/aem.js`: Core AEM utilities and functions
- `scripts/scripts.js`: Site-specific JavaScript functionality
- `component-definition.json`, `component-models.json`, `component-filters.json`: Generated configuration files
- `fstab.yaml`: AEM configuration file

## Development Commands

```bash
# Install dependencies
npm install

# Linting
npm run lint:js          # ESLint for JavaScript
npm run lint:css         # Stylelint for CSS
npm run lint             # Run both linters

# Build JSON configuration files
npm run build:json       # Build all JSON configs
npm run build:json:models
npm run build:json:definitions
npm run build:json:filters

# Local development
aem up                   # Start AEM CLI (requires @adobe/aem-cli)
```

## Block Development

Each block follows the pattern:
- `/blocks/{blockname}/{blockname}.js` - Block functionality
- `/blocks/{blockname}/{blockname}.css` - Block styling
- `/blocks/{blockname}/_{blockname}.json` - Block configuration (optional)

Import AEM utilities from `../../scripts/aem.js` in block files.

## DA Integration

This repo is modified for DA (Document Authoring) compatibility with live preview functionality.