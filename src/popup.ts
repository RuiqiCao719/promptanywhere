import { DependencyContainer } from './application/dependency-injection.js';

class PopupApp {
  private container: DependencyContainer;
  private configController: any;

  constructor() {
    this.container = DependencyContainer.getInstance();
    this.configController = this.container.getConfigController();
    this.init();
  }

  private async init() {
    this.setupEventListeners();
    await this.loadInitialState();
  }

  private setupEventListeners() {
    // Navigation
    document.getElementById('settingsBtn')?.addEventListener('click', () => this.showSettings());
    document.getElementById('backBtn')?.addEventListener('click', () => this.showMain());
    document.getElementById('setupApiKeyBtn')?.addEventListener('click', () => this.showSettings());

    // API Key management
    document.getElementById('saveApiKeyBtn')?.addEventListener('click', () => this.saveApiKey());
    document.getElementById('testApiKeyBtn')?.addEventListener('click', () => this.testApiKey());
    document.getElementById('clearApiKeyBtn')?.addEventListener('click', () => this.clearApiKey());

    // Actions
    document.getElementById('copyBtn')?.addEventListener('click', () => this.copyResponse());
    document.getElementById('retryBtn')?.addEventListener('click', () => this.retryLastPrompt());
    document.getElementById('newPromptBtn')?.addEventListener('click', () => this.resetToDefault());
  }

  private async loadInitialState() {
    try {
      // Check if there's a recent response or error
      const storage = await chrome.storage.local.get([
        'prompt_anywhere_response',
        'prompt_anywhere_error',
        'prompt_anywhere_processing',
        'prompt_anywhere_selected_text'
      ]);

      if (storage.prompt_anywhere_processing) {
        this.showLoading();
      } else if (storage.prompt_anywhere_error) {
        this.showError(storage.prompt_anywhere_error);
      } else if (storage.prompt_anywhere_response) {
        this.showResponse(storage.prompt_anywhere_response, storage.prompt_anywhere_selected_text);
      } else {
        // Check if API key is configured
        const config = await this.configController.getApiConfig();
        if (!config) {
          this.showNoApiKey();
        } else {
          this.showDefault();
        }
      }
    } catch (error) {
      this.showError('Failed to load extension state');
    }
  }

  private showMain() {
    document.getElementById('settingsPanel')?.classList.add('hidden');
    document.getElementById('mainContent')?.classList.remove('hidden');
  }

  private showSettings() {
    document.getElementById('mainContent')?.classList.add('hidden');
    document.getElementById('settingsPanel')?.classList.remove('hidden');
    this.loadApiKeySettings();
  }

  private async loadApiKeySettings() {
    try {
      const config = await this.configController.getApiConfig();
      const apiKeyInput = document.getElementById('apiKeyInput') as HTMLInputElement;
      if (apiKeyInput && config) {
        apiKeyInput.value = config.apiKey;
      }
    } catch (error) {
      console.error('Failed to load API key settings:', error);
    }
  }

  private showLoading() {
    this.hideAllStates();
    document.getElementById('loadingState')?.classList.remove('hidden');
  }

  private showError(message: string) {
    this.hideAllStates();
    document.getElementById('errorState')?.classList.remove('hidden');
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
      errorMessage.textContent = message;
    }
  }

  private showResponse(response: any, selectedText: string) {
    this.hideAllStates();
    document.getElementById('responseState')?.classList.remove('hidden');
    
    const selectedTextEl = document.getElementById('selectedText');
    const responseTextEl = document.getElementById('responseText');
    
    if (selectedTextEl) {
      selectedTextEl.textContent = selectedText || 'No text selected';
    }
    
    if (responseTextEl && response.content) {
      responseTextEl.textContent = response.content;
    }
  }

  private showNoApiKey() {
    this.hideAllStates();
    document.getElementById('noApiKeyState')?.classList.remove('hidden');
  }

  private showDefault() {
    this.hideAllStates();
    document.getElementById('defaultState')?.classList.remove('hidden');
  }

  private hideAllStates() {
    const states = [
      'loadingState',
      'errorState', 
      'responseState',
      'noApiKeyState',
      'defaultState'
    ];
    
    states.forEach(stateId => {
      document.getElementById(stateId)?.classList.add('hidden');
    });
  }

  private async saveApiKey() {
    const apiKeyInput = document.getElementById('apiKeyInput') as HTMLInputElement;
    const saveBtn = document.getElementById('saveApiKeyBtn') as HTMLButtonElement;
    const statusEl = document.getElementById('apiKeyStatus');

    if (!apiKeyInput || !saveBtn || !statusEl) return;

    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      this.showApiKeyStatus('Please enter an API key', 'error');
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
      await this.configController.saveApiKey(apiKey);
      this.showApiKeyStatus('API key saved successfully', 'success');
      
      // Clear any previous errors
      await chrome.storage.local.remove(['prompt_anywhere_error']);
      
      setTimeout(() => {
        this.showMain();
        this.showDefault();
      }, 1000);
    } catch (error) {
      this.showApiKeyStatus(error instanceof Error ? error.message : 'Failed to save API key', 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save';
    }
  }

  private async testApiKey() {
    const apiKeyInput = document.getElementById('apiKeyInput') as HTMLInputElement;
    const testBtn = document.getElementById('testApiKeyBtn') as HTMLButtonElement;

    if (!apiKeyInput || !testBtn) return;

    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      this.showApiKeyStatus('Please enter an API key', 'error');
      return;
    }

    testBtn.disabled = true;
    testBtn.textContent = 'Testing...';

    try {
      const isValid = await this.configController.testApiKey(apiKey);
      if (isValid) {
        this.showApiKeyStatus('API key is valid', 'success');
      } else {
        this.showApiKeyStatus('API key is invalid', 'error');
      }
    } catch (error) {
      this.showApiKeyStatus(error instanceof Error ? error.message : 'Failed to test API key', 'error');
    } finally {
      testBtn.disabled = false;
      testBtn.textContent = 'Test';
    }
  }

  private async clearApiKey() {
    const clearBtn = document.getElementById('clearApiKeyBtn') as HTMLButtonElement;
    if (!clearBtn) return;

    clearBtn.disabled = true;
    clearBtn.textContent = 'Clearing...';

    try {
      await this.configController.clearApiConfig();
      const apiKeyInput = document.getElementById('apiKeyInput') as HTMLInputElement;
      if (apiKeyInput) {
        apiKeyInput.value = '';
      }
      this.showApiKeyStatus('API key cleared', 'success');
      
      setTimeout(() => {
        this.showMain();
        this.showNoApiKey();
      }, 1000);
    } catch (error) {
      this.showApiKeyStatus(error instanceof Error ? error.message : 'Failed to clear API key', 'error');
    } finally {
      clearBtn.disabled = false;
      clearBtn.textContent = 'Clear API Key';
    }
  }

  private showApiKeyStatus(message: string, type: 'success' | 'error') {
    const statusEl = document.getElementById('apiKeyStatus');
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.className = `text-sm ${type === 'success' ? 'success-text' : 'error-text'}`;
    statusEl.classList.remove('hidden');

    setTimeout(() => {
      statusEl.classList.add('hidden');
    }, 3000);
  }

  private async copyResponse() {
    const responseTextEl = document.getElementById('responseText');
    if (!responseTextEl) return;

    try {
      await navigator.clipboard.writeText(responseTextEl.textContent || '');
      
      const copyBtn = document.getElementById('copyBtn') as HTMLButtonElement;
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('bg-green-500', 'hover:bg-green-600');
      copyBtn.classList.remove('bg-primary-500', 'hover:bg-primary-600');

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
        copyBtn.classList.add('bg-primary-500', 'hover:bg-primary-600');
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }

  private async retryLastPrompt() {
    const storage = await chrome.storage.local.get(['prompt_anywhere_selected_text']);
    if (storage.prompt_anywhere_selected_text) {
      // Clear error and show loading
      await chrome.storage.local.remove(['prompt_anywhere_error']);
      this.showLoading();
      
      // Trigger processing again
      chrome.runtime.sendMessage({
        type: 'RETRY_PROMPT',
        text: storage.prompt_anywhere_selected_text
      });
    }
  }

  private async resetToDefault() {
    // Clear all stored data
    await chrome.storage.local.remove([
      'prompt_anywhere_response',
      'prompt_anywhere_error',
      'prompt_anywhere_selected_text',
      'prompt_anywhere_processing'
    ]);
    
    this.showDefault();
  }
}

// Initialize the popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupApp();
}); 