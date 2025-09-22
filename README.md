# Better Page Ruler

A clean, lightweight browser extension for measuring webpage elements with ruler boxes.

## Features

- Draw ruler boxes by clicking and dragging
- Resize boxes using edge handles (horizontal/vertical)
- Diagonal resizing with corner handles
- Drag boxes to reposition them
- Toggle ruler mode with extension icon
- Close button for quick exit
- Works correctly with scrolled pages

## Supported Browsers

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Brave Browser
- Any Chromium-based browser

## Project Structure

```
better-page-ruler/
├── src/                    # Extension source files
│   ├── manifest.json       # Extension configuration (Manifest V3)
│   ├── background.js       # Service worker for extension icon clicks
│   ├── content.js          # Main ruler functionality
│   └── style.scss          # Ruler styling
├── scripts/               # Development and build tools
│   ├── build.js          # Build script for distribution
│   ├── dev-reload.js     # Development auto-reload watcher
│   └── reload-extension.js # Manual reload helper
├── icons/                # Extension icons
├── dist/                 # Built packages (generated)
└── package.json          # Project configuration
```

## Development

### Setup

```bash
pnpm install
```

### Auto-Reload Development

```bash
pnpm dev
```

```bash
pnpm watch
```

### Manual Setup

1. Open Chrome/Edge and go to `chrome://extensions/` or `edge://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked" and select the `src/` directory
4. Make code changes - use auto-reload for faster development

### Build for Distribution

```bash
# Build for all supported browsers
pnpm build

# Build for specific browser
pnpm build:chrome
pnpm build:firefox
pnpm build:edge
```

### Code Quality

```bash
# Lint JavaScript files
pnpm lint
pnpm lint:fix

# Format all files
pnpm format
pnpm format:check
```

## Usage

1. Click the extension icon to activate ruler mode
2. Click and drag to create ruler boxes
3. Use handles to resize boxes
4. Click extension icon again or use close button to exit
