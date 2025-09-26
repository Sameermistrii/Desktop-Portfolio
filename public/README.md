# Public Content Guide

Edit your site content here without touching any code.

- Messages (FAQ):
  - File: `public/messages/faq.json`
  - Format: Array of items: `{ "q": "Question", "a": "Answer", "icon": "star" | null }`
  - Changes are picked up on refresh. Keep valid JSON.

- Gallery:
  - Put/replace images in `public/gallery/`
  - Filenames and images are read directly from this folder by the gallery window.

- Projects:
  - Each project has its own folder inside `public/projects/` (e.g., `Project 01`, `Project 02`)
  - Add or replace images and assets inside each project folder.
  - Keep names human-readable.

- About Me:
  - Update assets/texts in `public/about-me/`

- Contact Info:
  - Update assets/texts in `public/contact-info/`

Tips:
- Prefer PNG/JPG/SVG images.
- Keep file names simple (letters, numbers, dashes, spaces ok).
- After edits, hard refresh your browser if you don’t see changes.