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
