# Use Guide

This project lets you update most content from the `public/` folder without touching code. Below is what you can change and how to run the app.

## How to run (Terminal)

Using npm:
1. Install deps: `npm install`
2. Start dev server: `npm run dev`
3. Build for production: `npm run build`
4. Run production server: `npm start`
5. Lint: `npm run lint`

Notes:
- Dev server: http://localhost:3000
- If you prefer pnpm or bun:
  - pnpm: `pnpm install` → `pnpm dev` → `pnpm build` → `pnpm start`
  - bun: `bun install` → `bun run dev` → `bun run build` → `bun run start`
- If you change files in `public/`, refresh the browser. For deployed builds, rebuild/redeploy.

## Editable content (public/)

These folders/files are safe to edit and are read by the app at runtime:

### 1) Contact (Header Contact link)
- File: `public/Section Header/contact.json`
- Format:
  ```json
  { "email": "your-email@example.com" }
  ```
- Behavior: The header Contact link opens Gmail compose in a new tab using your email.

### 2) Messages (FAQ)
- File: `public/messages/faq.json`
- Format: Array of items
  ```json
  [
    { "q": "Question?", "a": "Answer.", "icon": "star" }
  ]
  ```
- Tip: Keep valid JSON; remove `icon` or set `null` if not needed.

### 3) Gallery
- Folder: `public/gallery/`
- Action: Add/replace images (PNG/JPG/SVG). Filenames are read directly.

### 4) Projects
- Folder: `public/projects/`
- Each project has its own folder (e.g., `Project 01`, `Project 02`, ...).
- Action: Place project images/assets inside each project folder. Use readable names.

### 5) About Me
- Folder: `public/about-me/`
- Action: Update images/text assets that the About window reads.

### 6) Contact Info
- Folder: `public/contact-info/`
- Action: Update images/text assets for contact details.

### 7) Shortcuts (Dock/desktop quick links)
- Folder: `public/shortcuts/`
- Action: Add or update shortcut assets/icons as used by the UI.

### 8) To‑Do
- Folder: `public/to-do/`
- Action: Add default note assets/content if applicable. (The draggable note position resets on refresh.)

### 9) Desktop Files
- Folder: `public/Desktop/`
- Action: Add files/images that appear scattered on the desktop area.

### 10) Favicon
- File: `src/app/favicon.ico`
- Action: Replace to change the browser tab icon. Hard refresh to bypass cache.

## Tips & Troubleshooting
- Use simple filenames (letters, numbers, dashes, spaces).
- For images, prefer PNG/JPG/SVG.
- If changes don’t show up:
  - Hard refresh: Ctrl/Cmd+Shift+R
  - Clear cache or try a private window
  - For production, re-run `npm run build` and redeploy
- Validate JSON when editing `.json` files.