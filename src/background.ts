import { DependencyContainer } from './application/dependency-injection.js';

// Menu item ID
const MENU_ITEM_ID = 'prompt-anywhere-ask-gpt';

// Initialize context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ITEM_ID,
    title: 'Ask GPT-4o',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === MENU_ITEM_ID && info.selectionText && tab?.id) {
    try {
      const container = DependencyContainer.getInstance();
      const promptController = container.getPromptController();
      
      // Store the selected text for popup to access
      await chrome.storage.local.set({
        'prompt_anywhere_selected_text': info.selectionText,
        'prompt_anywhere_processing': true
      });

      // Process the text
      const response = await promptController.processSelectedText(info.selectionText);
      
      // Store the response
      await chrome.storage.local.set({
        'prompt_anywhere_response': response,
        'prompt_anywhere_processing': false
      });

      // Open popup to show the result
      chrome.action.openPopup();
      
    } catch (error) {
      // Store error for popup to display
      await chrome.storage.local.set({
        'prompt_anywhere_error': error instanceof Error ? error.message : 'Unknown error occurred',
        'prompt_anywhere_processing': false
      });

      // Open popup to show the error
      chrome.action.openPopup();
    }
  }
});

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SELECTED_TEXT') {
    // This is handled by content script injection
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => window.getSelection()?.toString() || ''
        }, (results) => {
          sendResponse({ selectedText: results?.[0]?.result || '' });
        });
      }
    });
    return true; // Keep message channel open for async response
  }
}); 