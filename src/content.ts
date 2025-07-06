// Content script for additional functionality if needed
// Currently minimal as most functionality is handled by background script

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_CURRENT_SELECTION') {
    const selectedText = window.getSelection()?.toString() || '';
    sendResponse({ selectedText });
  }
  return true;
});

// Optional: Add visual feedback when text is being processed
let processingIndicator: HTMLElement | null = null;

function showProcessingIndicator() {
  if (processingIndicator) return;
  
  processingIndicator = document.createElement('div');
  processingIndicator.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #3b82f6;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `;
  processingIndicator.textContent = 'Processing with GPT-4o...';
  document.body.appendChild(processingIndicator);
}

function hideProcessingIndicator() {
  if (processingIndicator) {
    processingIndicator.remove();
    processingIndicator = null;
  }
}

// Listen for storage changes to show/hide processing indicator
chrome.storage.onChanged.addListener((changes) => {
  if (changes['prompt_anywhere_processing']) {
    if (changes['prompt_anywhere_processing'].newValue) {
      showProcessingIndicator();
    } else {
      hideProcessingIndicator();
    }
  }
}); 