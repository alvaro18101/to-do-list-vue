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
- **Data model: tabs ("lists"), each with its own tasks**: `lists` is an array of `{ id, name, tasks: [{ id, title, completed }] }`, plus `activeListId`. Task methods operate on the `activeList` computed (`this.activeList.tasks`); the `tasks` computed is read-only for the template.
- **Persistence is automatic**: a deep `watch` on `lists` writes it to `localStorage` key `lists`, and a watch on `activeListId` writes key `activeListId`. Methods must not call `localStorage.setItem` themselves.
- **Ids are stable random hex strings** from `generateId()` (built on `crypto.getRandomValues`, not `crypto.randomUUID`, so it works over plain HTTP on a LAN IP), checked for uniqueness against all list and task ids. Nothing is re-indexed on delete.
- **Legacy migration**: `loadLists()` converts the pre-tabs format (key `tasks`, array of tasks with numeric ids) into a single "Mis tareas" list; `created()` saves it. The old `tasks` key is intentionally kept as a backup so a rollback to a pre-tabs deploy still shows the user's tasks; it is ignored once `lists` exists.
- Tab UI rules: rename/delete icons appear only on the active tab; the delete icon is hidden when only one list remains; deleting a list with tasks opens the in-app confirmation modal (empty lists are deleted directly); double-click rename is gated to `(hover: hover)` devices.
- **Styles are global CSS, not component styles.** `main.css`, `mediaqueries.css`, and `fonts.css` in `src/assets/css/` are linked directly from `index.html` (the imports in `App.vue`/`main.js` are commented out, and the `<style scoped>` block is empty). `main.css` imports `base.css`, which holds the color palette as CSS custom properties. Responsive rules go in `mediaqueries.css`.
- The PWA manifest references `/icons/icon-192x192.png` and `/icons/icon-512x512.png`, which do not currently exist in `public/`.
- `@` is aliased to `src/` (in both `vite.config.js` and `jsconfig.json`).

## Conventions

- Commit messages use Conventional Commit prefixes (`feat:`, `fix:`).
- Releases are recorded in `CHANGELOG.md` (version + date + feature list), and the version is also shown in `README.md`. `package.json`'s `version` is not used.
