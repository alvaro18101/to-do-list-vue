# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm install        # install dependencies
npm run dev        # Vite dev server with hot reload
npm run build      # production build to dist/
npm run preview    # serve the production build locally
```

There is no test suite, linter, or formatter configured.

## Architecture

A single-component Vue 3 + Vite to-do app, deployed on Netlify as a PWA (`vite-plugin-pwa`, `registerType: 'autoUpdate'`, configured in `vite.config.js`). UI text is in Spanish.

- **All app logic lives in `src/App.vue`**, written with the Options API (`data()` / `methods`), not `<script setup>`. `src/main.js` just mounts it.
- **Persistence is `localStorage` under the key `tasks`** (a JSON array of `{ id, title, completed }`). Every mutating method (`addTask`, `deleteTask`, `deleteAll`, `deleteCompleted`, `checkCompleted`) writes the whole array back to `localStorage` explicitly — there is no watcher, so any new mutation must do the same.
- **Task ids are positional, not stable**: after deletions, tasks are re-indexed to `index + 1` and `idCounter` is reset to `tasks.length + 1`. `v-for` keys on `task.id`.
- `addTask` reads the input value directly from the DOM (`document.getElementById('task-title')`) rather than through `v-model`.
- **Styles are global CSS, not component styles.** `main.css`, `mediaqueries.css`, and `fonts.css` in `src/assets/css/` are linked directly from `index.html` (the imports in `App.vue`/`main.js` are commented out, and the `<style scoped>` block is empty). `main.css` imports `base.css`, which holds the color palette as CSS custom properties. Responsive rules go in `mediaqueries.css`.
- The PWA manifest references `/icons/icon-192x192.png` and `/icons/icon-512x512.png`, which do not currently exist in `public/`.
- `@` is aliased to `src/` (in both `vite.config.js` and `jsconfig.json`).

## Conventions

- Commit messages use Conventional Commit prefixes (`feat:`, `fix:`).
- Releases are recorded in `CHANGELOG.md` (version + date + feature list), and the version is also shown in `README.md`. `package.json`'s `version` is not used.
