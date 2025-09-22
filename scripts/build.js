#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sass = require('sass');

const browsers = {
	chrome: {
		manifest: 'src/manifest.json',
		background: 'src/background.js',
		outputDir: 'dist/chrome',
	},
	firefox: {
		manifest: 'src/manifest.json',
		background: 'src/background.js',
		outputDir: 'dist/firefox',
	},
	edge: {
		manifest: 'src/manifest.json',
		background: 'src/background.js',
		outputDir: 'dist/edge',
	},
};

const commonFiles = ['src/content.js', 'src/icons/icon16.png', 'src/icons/icon48.png', 'src/icons/icon128.png'];

// SCSS source file
const scssFile = 'src/style.scss';

function ensureDir(dir) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, {recursive: true});
	}
}

function copyFile(src, dest) {
	if (fs.existsSync(src)) {
		fs.copyFileSync(src, dest);
		console.log(`✅ Copied ${src} → ${dest}`);
	} else {
		console.log(`⚠️  Missing: ${src}`);
	}
}

function generateBrowserSpecificManifest(browserName, manifestSrc, manifestDest) {
	if (!fs.existsSync(manifestSrc)) {
		console.log(`⚠️  Missing manifest: ${manifestSrc}`);
		return;
	}

	// Read the base manifest
	const manifestContent = fs.readFileSync(manifestSrc, 'utf8');
	let manifest;

	try {
		// Remove comments for JSON parsing
		const cleanContent = manifestContent.replace(/\/\/.*$/gm, '');
		manifest = JSON.parse(cleanContent);
	} catch (error) {
		console.log(`❌ Error parsing manifest: ${error.message}`);
		return;
	}

	// Browser-specific modifications
	switch (browserName) {
		case 'chrome':
		case 'edge':
			if (manifest.background.scripts) {
				delete manifest.background.scripts;
			}
			break;

		case 'firefox':
			if (manifest.background.service_worker) {
				delete manifest.background.service_worker;
			}
			break;

		default:
			console.log(`⚠️  Unknown browser: ${browserName}`);
			return;
	}

	// Write the modified manifest
	fs.writeFileSync(manifestDest, JSON.stringify(manifest, null, 2));
	console.log(`✅ Generated ${browserName} manifest → ${manifestDest}`);
}

function compileSCSS(browserName, outputDir) {
	if (!fs.existsSync(scssFile)) {
		console.log(`⚠️  Missing SCSS file: ${scssFile}`);
		return;
	}

	// Browser-specific SCSS variables
	const browserVars = {
		chrome: "$browser: 'chrome'; $manifest-version: 3;",
		firefox: "$browser: 'firefox'; $manifest-version: 2;",
		edge: "$browser: 'edge'; $manifest-version: 3;",
	};

	const variables = browserVars[browserName] || browserVars.chrome;

	try {
		// Read SCSS content and prepend browser variables
		const scssContent = fs.readFileSync(scssFile, 'utf8');
		const fullScssContent = `${variables}\n${scssContent}`;

		// Compile SCSS to CSS
		const result = sass.compileString(fullScssContent, {
			style: 'expanded',
			sourceMap: false,
		});

		// Write compiled CSS
		const cssPath = path.join(outputDir, 'style.css');
		fs.writeFileSync(cssPath, result.css);
		console.log(`✅ Compiled SCSS for ${browserName} → ${cssPath}`);
	} catch (error) {
		console.log(`❌ SCSS compilation failed for ${browserName}: ${error.message}`);
	}
}

function buildForBrowser(browserName, config) {
	console.log(`\n🔨 Building for ${browserName.toUpperCase()}...`);

	const outputDir = config.outputDir;
	ensureDir(outputDir);

	// Generate browser-specific manifest
	const manifestSrc = config.manifest;
	const manifestDest = path.join(outputDir, 'manifest.json');
	generateBrowserSpecificManifest(browserName, manifestSrc, manifestDest);

	// Compile browser-specific SCSS
	compileSCSS(browserName, outputDir);

	// Copy background script
	const backgroundSrc = config.background;
	const backgroundDest = path.join(outputDir, 'background.js');
	copyFile(backgroundSrc, backgroundDest);

	// Copy common files
	commonFiles.forEach(file => {
		const src = file;
		let dest;

		// Handle icons directory structure
		if (file.includes('icons/')) {
			// Ensure icons directory exists in output
			const iconsDir = path.join(outputDir, 'icons');
			ensureDir(iconsDir);
			dest = path.join(outputDir, 'icons', path.basename(file));
		} else {
			dest = path.join(outputDir, path.basename(file));
		}

		copyFile(src, dest);
	});

	console.log(`✅ ${browserName.toUpperCase()} build complete: ${outputDir}`);
}

function buildAll() {
	console.log('🚀 Building Better Page Ruler for all browsers...\n');

	// Ensure dist directory exists
	ensureDir('dist');

	// Build for each browser
	Object.entries(browsers).forEach(([browserName, config]) => {
		buildForBrowser(browserName, config);
	});

	console.log('\n🎉 All builds complete!');
	console.log('\n📦 Distribution packages:');
	Object.entries(browsers).forEach(([browserName, config]) => {
		console.log(`   ${browserName.toUpperCase()}: ${config.outputDir}/`);
	});

	console.log('\n📋 Next steps:');
	console.log('   Chrome/Edge: Load unpacked from dist/chrome/');
	console.log('   Firefox: Load temporary add-on from dist/firefox/');
}

// Run if called directly
if (require.main === module) {
	const browser = process.argv[2];

	if (browser && browsers[browser]) {
		buildForBrowser(browser, browsers[browser]);
	} else if (browser) {
		console.log(`❌ Unknown browser: ${browser}`);
		console.log(`Available: ${Object.keys(browsers).join(', ')}`);
	} else {
		buildAll();
	}
}
