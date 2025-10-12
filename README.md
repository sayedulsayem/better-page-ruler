# Better Page Ruler

A clean, lightweight, and open-source browser extension for measuring webpage elements with ruler boxes.

![Better Page Ruler in action](https://via.placeholder.com/720x400.png?text=Better+Page+Ruler+In+Action)
*(Help us replace this placeholder! If you enjoy this tool, consider contributing a GIF of it in action.)*

## Features

Better Page Ruler is designed for developers, designers, and anyone who needs precise measurements on a webpage.

- Draw ruler boxes by clicking and dragging
- Resize boxes using edge handles (horizontal/vertical)
- Diagonal resizing with corner handles
- Drag boxes to reposition them
- Toggle ruler mode with extension icon
- Close button for quick exit
- Works correctly with scrolled pages

## Why Better Page Ruler?

Many existing ruler extensions are outdated, haven't been updated for Manifest V3, or inject intrusive code. This project aims to provide a modern, minimal, and maintainable solution that respects user privacy and stays up-to-date with browser standards.

## Installation

You can install the extension from the official web stores:

- [**Mozilla Firefox**](https://addons.mozilla.org/en-US/firefox/addon/better-page-ruler/?utm_source=github)
- [**Microsoft Edge**](https://microsoftedge.microsoft.com/addons/detail/better-page-ruler/lahbaibhcljkhimfllplchmekijjichp?utm_source=github)

- [**Google Chrome**](https://chromewebstore.google.com/detail/imjbimehdchihkehnnkdgpnckafghjpe?utm_source=github)

## Supported Browsers

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Brave Browser
- Any Chromium-based browser

## Project Structure

The project is organized to be easy to navigate for developers.

```
better-page-ruler/
├── scripts/              # Development and build tools
│   ├── build.js            # Build script for distribution
│   ├── dev-reload.js       # Development auto-reload watcher
│   └── reload-extension.js # Manual reload helper
├── src/                  # Extension source files
│   ├── icons/              # Extension icons
│   ├── background.js       # Service worker for extension icon clicks
│   ├── content.js          # Main ruler functionality
│   ├── manifest.json       # Extension configuration (Manifest V3)
│   └── style.scss          # Ruler styling
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

## Contributing

Contributions are welcome! Whether it's bug reports, feature requests, or code contributions, please feel free to open an issue or submit a pull request.

## License

[MIT](LICENSE) © [**Sayedul Sayem**](https://sayedulsayem.com)
