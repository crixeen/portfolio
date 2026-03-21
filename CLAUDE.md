# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server at http://localhost:4321
pnpm build      # Build for production (output: dist/)
pnpm preview    # Preview production build locally
pnpm format     # Format code with Prettier
```

No test or lint commands are configured.

## Architecture

Single-page portfolio built with **Astro 5.x**, deployed to **Netlify**.

**Page composition** (`src/pages/index.astro`):
- Imports and composes all section components in order: Cursor → Navbar → Hero → About → Skills → Experience → Projects → Reviews → Contact → Footer → RevealObserver
- `src/layouts/Layout.astro` wraps everything with the base HTML shell

**Styling** (`public/css/global.css`):
- Dark theme with warm gold accent (`--accent: #c8965a` / `--accent-light: #e8b87a`)
- CSS custom properties throughout — update variables before touching individual rules
- Fonts: Instrument Sans (body), DM Mono (nav/code), PlayfairDisplay (logo)

**Project data** (`src/data/projects.json`):
- Single source of truth for the projects gallery
- Exported via `src/js/projects.js` and consumed by `src/components/Projects.astro`
- Each entry: id, title, category, tags, cover, description, github, live, gallery array

**Form** (`src/components/Contact.astro` + `src/js/formValidation.js`):
- Netlify Forms handles submission (no backend needed)
- `formValidation.js` runs entirely client-side: real-time field validation, rate limiting (3 attempts/60s), honeypot bot detection, banned-word filtering, disposable-email blocklist
- Honeypot field is `bot-field`

**Animations** (`src/components/RevealObserver.astro`):
- Uses IntersectionObserver (threshold 0.08) to trigger `.visible` class on scroll
- Elements needing reveal animations should have the `reveal` class

## Code Style

Formatting enforced by Prettier (`.prettierrc`): **tabs** (width 4), single quotes, print width 180, semicolons on.
EditorConfig: tabs, LF line endings, UTF-8, final newline required.
