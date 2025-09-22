#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');
const sass = require('sass');

// Extension directory (parent of scripts directory)
const extensionDir = path.dirname(__dirname);

// Files to watch
const filesToWatch = ['src/manifest.json', 'src/background.js', 'src/content.js', 'src/style.scss'];

// SCSS compilation function
function compileSCSS() {
	const scssFile = path.join(extensionDir, 'src/style.scss');
	const cssFile = path.join(extensionDir, 'src/style.css');

	if (!fs.existsSync(scssFile)) {
		console.log('⚠️  SCSS file not found:', scssFile);
		return;
	}

	try {
		// Compile SCSS to CSS for development (Chrome defaults)
		const result = sass.compile(scssFile, {
			style: 'expanded',
			sourceMap: false,
		});

		// Write compiled CSS
		fs.writeFileSync(cssFile, result.css);
		console.log('✅ SCSS compiled to CSS');
	} catch (error) {
		console.log('❌ SCSS compilation failed:', error.message);
	}
}

console.log('🔧 Chrome Extension Auto-Reload Started');
console.log('📁 Watching:', extensionDir);
console.log('📄 Files:', filesToWatch.join(', '));
console.log('\n💡 Instructions:');
console.log('1. Load your extension in Chrome (chrome://extensions/)');
console.log('2. Enable "Developer mode"');
console.log('3. Note your extension ID from the extension card');
console.log('4. Make code changes - extension will auto-reload and open https://sayedulsayem.com!\n');

// Initial SCSS compilation
console.log('🎨 Compiling SCSS...');
compileSCSS();

// Watch for file changes
filesToWatch.forEach(file => {
	const filePath = path.join(extensionDir, file);

	if (fs.existsSync(filePath)) {
		fs.watchFile(filePath, {interval: 1000}, (curr, prev) => {
			if (curr.mtime !== prev.mtime) {
				console.log(`📝 ${file} changed`);

				// Compile SCSS if it's the SCSS file that changed
				if (file === 'src/style.scss') {
					compileSCSS();
				}

				console.log('🔄 Reloading extension...');
				reloadExtension();
			}
		});
		console.log(`👀 Watching: ${file}`);
	}
});

function reloadExtension() {
	console.log('🔄 File changed detected!');

	// Smart AppleScript to check for existing sayedulsayem.com tab or reload current tab
	const script = `
    tell application "Google Chrome"
      set websiteTabFound to false
      set websiteTabIndex to 0
      set websiteWindowIndex to 0

      -- Check all windows and tabs for https://sayedulsayem.com
      repeat with w from 1 to count of windows
        repeat with t from 1 to count of tabs of window w
          if URL of tab t of window w starts with "https://sayedulsayem.com" then
            set websiteTabFound to true
            set websiteTabIndex to t
            set websiteWindowIndex to w
            exit repeat
          end if
        end repeat
        if websiteTabFound then exit repeat
      end repeat

      if websiteTabFound then
        -- Focus existing website tab and reload it
        set active tab index of window websiteWindowIndex to websiteTabIndex
        set index of window websiteWindowIndex to 1
        tell tab websiteTabIndex of window websiteWindowIndex to reload
        return "reloaded_existing"
      else
        -- Check if current tab is any website, then navigate to sayedulsayem.com
        try
          set currentURL to URL of active tab of front window
          if currentURL does not start with "chrome://" and currentURL does not start with "chrome-extension://" then
            set URL of active tab of front window to "https://sayedulsayem.com"
            return "navigated_current"
          else
            -- Open new tab with sayedulsayem.com
            tell front window to make new tab with properties {URL:"https://sayedulsayem.com"}
            return "opened_new"
          end if
        on error
          -- Fallback: open new tab
          tell front window to make new tab with properties {URL:"https://sayedulsayem.com"}
          return "opened_new_fallback"
        end try
      end if
    end tell
  `;

	exec(`osascript -e '${script}'`, (error, stdout) => {
		if (error) {
			console.log('⚠️  Smart tab handling failed, opening normally...');
			exec('open -a "Google Chrome" "https://sayedulsayem.com"');
		} else {
			const result = stdout.trim();
			switch (result) {
				case 'reloaded_existing':
					console.log('🔄 Reloaded existing https://sayedulsayem.com tab');
					break;
				case 'navigated_current':
					console.log('🌐 Navigated current tab to https://sayedulsayem.com');
					break;
				case 'opened_new':
					console.log('🆕 Opened https://sayedulsayem.com in new tab');
					break;
				default:
					console.log('🌐 Opened https://sayedulsayem.com');
			}
		}

		console.log('📋 Test your Better Page Ruler extension on https://sayedulsayem.com!');
		console.log('💡 Remember to manually reload the extension in chrome://extensions/ if needed');
		console.log('');
	});
}

// Keep the script running
process.on('SIGINT', () => {
	console.log('\n👋 Auto-reload stopped');
	process.exit(0);
});
