# Messages (FAQ) Content

Edit `faq.json` to control the messages shown in the Messages window (opened from the dock).

Example structure:
```json
[
  {
    "q": "What kind of designer are you?",
    "a": "One who balances precision with playfulness...",
    "icon": "star"
  },
  {
    "q": "Favorite kind of project to work on?",
    "a": "Interactive product design, creative websites...",
    "icon": null
  }
]
```

Notes:
- `icon` is optional. Use `"star"` to show a small star on that question, or `null`/omit to hide.
- Keep the JSON valid (commas, quotes, brackets).
- Save and refresh the page to see updates.