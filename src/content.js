(() => {
	// Prevent multiple injections
	if (window.pageRulerLoaded) {
		return;
	}
	window.pageRulerLoaded = true;

	let isDrawing = false;
	let startX, startY;
	let ruler;
	let overlay, closeBtn;

	function activateRuler() {
		if (document.querySelector('.better-page-ruler-overlay')) {
			return;
		} // already active

		// Overlay
		overlay = document.createElement('div');
		overlay.className = 'better-page-ruler-overlay';

		// Set overlay to cover the entire document
		overlay.style.height = `${Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)}px`;

		// Grid
		const grid = document.createElement('div');
		grid.className = 'better-page-ruler-grid';
		overlay.appendChild(grid);

		document.body.appendChild(overlay);
		// Don't disable body overflow - allow page scrolling

		// Main close button
		closeBtn = document.createElement('button');
		closeBtn.className = 'better-page-ruler-close-btn';
		closeBtn.textContent = 'Close Ruler Mode';
		document.body.appendChild(closeBtn);

		closeBtn.addEventListener('click', deactivateRuler);

		// Event listeners for both mouse and touch
		overlay.addEventListener('mousedown', onMouseDown);
		overlay.addEventListener('touchstart', onTouchStart, {passive: false});
	}

	function deactivateRuler() {
		const existingOverlay = document.querySelector('.better-page-ruler-overlay');
		const existingCloseBtn = document.querySelector('.better-page-ruler-close-btn');

		if (existingOverlay) {
			existingOverlay.remove();
		}
		if (existingCloseBtn) {
			existingCloseBtn.remove();
		}
		// Body overflow was not modified, so no need to restore

		// Clean up any active drawing
		isDrawing = false;
		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('mouseup', onMouseUp);
	}

	function toggleRuler() {
		if (document.querySelector('.better-page-ruler-overlay')) {
			deactivateRuler();
		} else {
			activateRuler();
		}
	}

	// Helper function to get coordinates from mouse or touch event
	function getEventCoordinates(e) {
		if (e.touches && e.touches.length > 0) {
			return {
				clientX: e.touches[0].clientX,
				clientY: e.touches[0].clientY,
			};
		}
		return {
			clientX: e.clientX,
			clientY: e.clientY,
		};
	}

	// Draw box - Mouse events
	const onMouseDown = e => {
		if (e.target !== overlay) {
			return;
		}
		startDrawing(e);
	};

	// Draw box - Touch events
	const onTouchStart = e => {
		if (e.target !== overlay) {
			return;
		}
		e.preventDefault(); // Prevent scrolling
		startDrawing(e);
	};

	// Common drawing start logic
	function startDrawing(e) {
		isDrawing = true;
		const coords = getEventCoordinates(e);
		startX = coords.clientX + window.scrollX;
		startY = coords.clientY + window.scrollY;

		ruler = createRulerBox(startX, startY);
		overlay.appendChild(ruler);

		// Add both mouse and touch move/end listeners
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
		document.addEventListener('touchmove', onTouchMove, {passive: false});
		document.addEventListener('touchend', onTouchEnd);
	}

	const onMouseMove = e => {
		if (!isDrawing) {
			return;
		}
		updateRulerSize(e);
	};

	const onTouchMove = e => {
		if (!isDrawing) {
			return;
		}
		e.preventDefault(); // Prevent scrolling
		updateRulerSize(e);
	};

	// Common ruler size update logic
	function updateRulerSize(e) {
		const coords = getEventCoordinates(e);
		const currentX = coords.clientX + window.scrollX;
		const currentY = coords.clientY + window.scrollY;
		const width = currentX - startX;
		const height = currentY - startY;

		const absWidth = Math.abs(width);
		const absHeight = Math.abs(height);

		ruler.style.width = `${absWidth}px`;
		ruler.style.height = `${absHeight}px`;
		ruler.style.left = `${width < 0 ? currentX : startX}px`;
		ruler.style.top = `${height < 0 ? currentY : startY}px`;

		// Update dimensions display
		updateDimensionsDisplay(ruler, absWidth, absHeight);
	}

	const onMouseUp = () => {
		stopDrawing();
	};

	const onTouchEnd = () => {
		stopDrawing();
	};

	// Common drawing stop logic
	function stopDrawing() {
		isDrawing = false;
		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('mouseup', onMouseUp);
		document.removeEventListener('touchmove', onTouchMove);
		document.removeEventListener('touchend', onTouchEnd);
	}

	// Create a ruler box with close + handles
	function createRulerBox(x, y) {
		const box = document.createElement('div');
		box.className = 'better-page-ruler-box';
		box.style.left = `${x}px`;
		box.style.top = `${y}px`;

		// Dimensions display
		const dimensionsDisplay = document.createElement('div');
		dimensionsDisplay.className = 'better-page-ruler-dimensions';
		dimensionsDisplay.textContent = '0 × 0';
		box.appendChild(dimensionsDisplay);

		// Box close button
		const boxClose = document.createElement('button');
		boxClose.className = 'better-page-ruler-box-close';
		boxClose.textContent = 'X';
		box.appendChild(boxClose);
		boxClose.addEventListener('click', () => box.remove());

		// Resize handles
		['left', 'right', 'top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(dir => {
			const handle = document.createElement('div');
			handle.className = `better-page-ruler-handle ${dir}`;
			box.appendChild(handle);
			makeResizable(box, handle, dir);
		});

		// Draggable
		makeDraggable(box);

		return box;
	}

	// Drag box
	function makeDraggable(el) {
		let offsetX,
			offsetY,
			isDragging = false;

		// Mouse events
		el.addEventListener('mousedown', e => {
			if (e.target !== el) {
				return;
			} // ignore handles and close button
			startDrag(e);
		});

		// Touch events
		el.addEventListener(
			'touchstart',
			e => {
				if (e.target !== el) {
					return;
				} // ignore handles and close button
				e.preventDefault();
				startDrag(e);
			},
			{passive: false}
		);

		function startDrag(e) {
			isDragging = true;
			const coords = getEventCoordinates(e);
			const mouseX = coords.clientX + window.scrollX;
			const mouseY = coords.clientY + window.scrollY;
			offsetX = mouseX - parseInt(el.style.left || 0);
			offsetY = mouseY - parseInt(el.style.top || 0);

			document.addEventListener('mousemove', dragMove);
			document.addEventListener('mouseup', dragStop);
			document.addEventListener('touchmove', dragMove, {passive: false});
			document.addEventListener('touchend', dragStop);
		}

		function dragMove(e) {
			if (!isDragging) {
				return;
			}
			if (e.type === 'touchmove') {
				e.preventDefault();
			}
			const coords = getEventCoordinates(e);
			const mouseX = coords.clientX + window.scrollX;
			const mouseY = coords.clientY + window.scrollY;
			el.style.left = `${mouseX - offsetX}px`;
			el.style.top = `${mouseY - offsetY}px`;
		}

		function dragStop() {
			isDragging = false;
			document.removeEventListener('mousemove', dragMove);
			document.removeEventListener('mouseup', dragStop);
			document.removeEventListener('touchmove', dragMove);
			document.removeEventListener('touchend', dragStop);
		}
	}

	// Resize logic
	function makeResizable(el, handle, dir) {
		let isResizing = false,
			startX,
			startY,
			startW,
			startH,
			startL,
			startT;

		// Mouse events
		handle.addEventListener('mousedown', e => {
			e.stopPropagation();
			startResize(e);
		});

		// Touch events
		handle.addEventListener(
			'touchstart',
			e => {
				e.stopPropagation();
				e.preventDefault();
				startResize(e);
			},
			{passive: false}
		);

		function startResize(e) {
			isResizing = true;
			const coords = getEventCoordinates(e);
			startX = coords.clientX + window.scrollX;
			startY = coords.clientY + window.scrollY;
			startW = el.offsetWidth;
			startH = el.offsetHeight;
			startL = parseInt(el.style.left || 0);
			startT = parseInt(el.style.top || 0);

			document.addEventListener('mousemove', resizeMove);
			document.addEventListener('mouseup', resizeStop);
			document.addEventListener('touchmove', resizeMove, {passive: false});
			document.addEventListener('touchend', resizeStop);
		}

		function resizeMove(e) {
			if (!isResizing) {
				return;
			}
			if (e.type === 'touchmove') {
				e.preventDefault();
			}
			const coords = getEventCoordinates(e);
			const currentX = coords.clientX + window.scrollX;
			const currentY = coords.clientY + window.scrollY;
			const deltaX = currentX - startX;
			const deltaY = currentY - startY;

			if (dir === 'right') {
				el.style.width = `${startW + deltaX}px`;
			}
			if (dir === 'left') {
				el.style.width = `${startW - deltaX}px`;
				el.style.left = `${startL + deltaX}px`;
			}
			if (dir === 'bottom') {
				el.style.height = `${startH + deltaY}px`;
			}
			if (dir === 'top') {
				el.style.height = `${startH - deltaY}px`;
				el.style.top = `${startT + deltaY}px`;
			}

			// Corner handles - diagonal resizing
			if (dir === 'top-left') {
				el.style.width = `${startW - deltaX}px`;
				el.style.height = `${startH - deltaY}px`;
				el.style.left = `${startL + deltaX}px`;
				el.style.top = `${startT + deltaY}px`;
			}
			if (dir === 'top-right') {
				el.style.width = `${startW + deltaX}px`;
				el.style.height = `${startH - deltaY}px`;
				el.style.top = `${startT + deltaY}px`;
			}
			if (dir === 'bottom-left') {
				el.style.width = `${startW - deltaX}px`;
				el.style.height = `${startH + deltaY}px`;
				el.style.left = `${startL + deltaX}px`;
			}
			if (dir === 'bottom-right') {
				el.style.width = `${startW + deltaX}px`;
				el.style.height = `${startH + deltaY}px`;
			}

			// Update dimensions display during resize
			const currentWidth = parseInt(el.style.width) || 0;
			const currentHeight = parseInt(el.style.height) || 0;
			updateDimensionsDisplay(el, currentWidth, currentHeight);
		}

		function resizeStop() {
			isResizing = false;
			document.removeEventListener('mousemove', resizeMove);
			document.removeEventListener('mouseup', resizeStop);
			document.removeEventListener('touchmove', resizeMove);
			document.removeEventListener('touchend', resizeStop);
		}
	}

	// Update dimensions display
	function updateDimensionsDisplay(box, width, height) {
		const dimensionsDisplay = box.querySelector('.better-page-ruler-dimensions');
		if (dimensionsDisplay) {
			dimensionsDisplay.textContent = `W:${Math.round(width)}px x H:${Math.round(height)}px`;
		}
	}

	// Message listener for extension icon clicks
	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message.action === 'toggleRuler') {
			toggleRuler();
			sendResponse({success: true});
		}
	});
})();
