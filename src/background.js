// Use the 'browser' namespace for cross-browser compatibility.
// It's supported in both Chrome (MV3) and Firefox.
browser.action.onClicked.addListener(async tab => {
	// The 'activeTab' permission grants access to the tab's host,
	// allowing script and CSS injection without needing broad host permissions.
	try {
		await browser.scripting.executeScript({
			target: {tabId: tab.id},
			files: ['content.js'],
		});
		await browser.scripting.insertCSS({
			target: {tabId: tab.id},
			files: ['style.css'],
		});
	} catch (error) {
		// The content script might have been injected in a previous click.
		// This error is expected and can be safely ignored.
	}
	// After ensuring the script is injected, send a message to toggle the ruler.
	browser.tabs.sendMessage(tab.id, {action: 'toggleRuler'});
});
