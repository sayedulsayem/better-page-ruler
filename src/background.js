// Listen for browser action clicks
if (chrome && chrome.action && chrome.action.onClicked) {
	chrome.action.onClicked.addListener(async tab => {
		// First, ensure the content script and CSS are injected
		try {
			await chrome.scripting.executeScript({
				target: {tabId: tab.id},
				files: ['content.js'],
			});
			await chrome.scripting.insertCSS({
				target: {tabId: tab.id},
				files: ['style.css'],
			});
		} catch (error) {
			// Content script might already be injected, that's okay
		}

		// Send toggle message to content script
		chrome.tabs.sendMessage(tab.id, {action: 'toggleRuler'});
	});
} else if (browser && browser === 'firefox') {
	// Firefox doesn't support chrome.action.onClicked, so we need to use a different approach
	browser.browserAction.onClicked.addListener(tab => {
		// First, ensure the content script and CSS are injected
		try {
			browser.tabs.executeScript({
				tabId: tab.id,
				files: ['content.js'],
			});
			browser.tabs.insertCSS({
				tabId: tab.id,
				files: ['style.css'],
			});
		} catch (error) {
			// Content script might already be injected, that's okay
		}

		// Send toggle message to content script
		browser.tabs.sendMessage(tab.id, {action: 'toggleRuler'});
	});
}
