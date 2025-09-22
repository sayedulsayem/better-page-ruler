// Simple Chrome Extension Auto-Reloader
// This script can be used to quickly navigate to chrome://extensions/ and reload your extension
//
// Usage Instructions:
// 1. Run this script from any webpage (including https://sayedulsayem.com)
// 2. It will open chrome://extensions/ in a new tab
// 3. You can then manually click the reload button for your extension
//
// Alternatively, create a bookmarklet with this code:
// javascript:(function(){window.open('chrome://extensions/','_blank');console.log('Opened chrome://extensions/ - click reload button for your extension');})();

// Browser console version:
if (typeof document !== 'undefined') {
	// Check if we're already on chrome://extensions/
	if (window.location.href.startsWith('chrome://extensions/')) {
		const reloadButtons = document.querySelectorAll('cr-icon-button[aria-label*="Reload"]');
		if (reloadButtons.length > 0) {
			reloadButtons[0].click();
			console.log('Extension reloaded!');
		} else {
			console.log('No extensions found to reload.');
		}
	} else {
		// Open chrome://extensions/ in new tab from any website
		window.open('chrome://extensions/', '_blank');
		console.log(
			'Opened chrome://extensions/ in new tab - click the reload button for your Better Page Ruler extension'
		);
		console.log(
			'💡 Tip: You can also use the dev-reload script which automatically opens https://sayedulsayem.com for testing!'
		);
	}
} else {
	console.log('This script must be run in a browser environment');
}
