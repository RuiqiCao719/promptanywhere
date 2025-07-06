// 简化版弹窗脚本

// DOM 元素
const elements = {
  mainTab: document.getElementById('mainTab'),
  settingsTab: document.getElementById('settingsTab'),
  mainContent: document.getElementById('mainContent'),
  settingsContent: document.getElementById('settingsContent'),
  
  // 状态元素
  loadingState: document.getElementById('loadingState'),
  errorState: document.getElementById('errorState'),
  responseState: document.getElementById('responseState'),
  emptyState: document.getElementById('emptyState'),
  
  // 内容元素
  errorMessage: document.getElementById('errorMessage'),
  responseContent: document.getElementById('responseContent'),
  
  // 按钮
  retryBtn: document.getElementById('retryBtn'),
  copyBtn: document.getElementById('copyBtn'),
  newQueryBtn: document.getElementById('newQueryBtn'),
  
  // 设置表单
  apiKey: document.getElementById('apiKey'),
  model: document.getElementById('model'),
  systemPrompt: document.getElementById('systemPrompt'),
  temperature: document.getElementById('temperature'),
  saveBtn: document.getElementById('saveBtn'),
  testBtn: document.getElementById('testBtn'),
  settingsStatus: document.getElementById('settingsStatus')
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  loadInitialState();
  bindEvents();
});

// 绑定事件
function bindEvents() {
  // 导航按钮
  elements.mainTab.addEventListener('click', () => showTab('main'));
  elements.settingsTab.addEventListener('click', () => showTab('settings'));
  
  // 主界面按钮
  elements.retryBtn.addEventListener('click', handleRetry);
  elements.copyBtn.addEventListener('click', handleCopy);
  elements.newQueryBtn.addEventListener('click', handleNewQuery);
  
  // 设置按钮
  elements.saveBtn.addEventListener('click', handleSave);
  elements.testBtn.addEventListener('click', handleTest);
}

// 显示标签页
function showTab(tab) {
  if (tab === 'main') {
    elements.mainTab.classList.add('active');
    elements.settingsTab.classList.remove('active');
    elements.mainContent.classList.remove('hidden');
    elements.settingsContent.classList.add('hidden');
  } else {
    elements.settingsTab.classList.add('active');
    elements.mainTab.classList.remove('active');
    elements.settingsContent.classList.remove('hidden');
    elements.mainContent.classList.add('hidden');
    loadSettings();
  }
}

// 加载初始状态
async function loadInitialState() {
  try {
    const data = await chrome.storage.local.get([
      'prompt_anywhere_processing',
      'prompt_anywhere_response',
      'prompt_anywhere_error',
      'prompt_anywhere_selected_text'
    ]);

    if (data.prompt_anywhere_processing) {
      showLoadingState();
    } else if (data.prompt_anywhere_error) {
      showErrorState(data.prompt_anywhere_error);
    } else if (data.prompt_anywhere_response) {
      showResponseState(data.prompt_anywhere_response.content);
    } else {
      showEmptyState();
    }
  } catch (error) {
    console.error('Error loading initial state:', error);
    showEmptyState();
  }
}

// 显示各种状态
function showEmptyState() {
  hideAllStates();
  elements.emptyState.classList.remove('hidden');
}

function showLoadingState() {
  hideAllStates();
  elements.loadingState.classList.remove('hidden');
}

function showErrorState(error) {
  hideAllStates();
  elements.errorState.classList.remove('hidden');
  elements.errorMessage.textContent = error;
}

function showResponseState(response) {
  hideAllStates();
  elements.responseState.classList.remove('hidden');
  elements.responseContent.textContent = response;
}

function hideAllStates() {
  elements.loadingState.classList.add('hidden');
  elements.errorState.classList.add('hidden');
  elements.responseState.classList.add('hidden');
  elements.emptyState.classList.add('hidden');
}

// 处理重试
async function handleRetry() {
  try {
    const data = await chrome.storage.local.get('prompt_anywhere_selected_text');
    if (data.prompt_anywhere_selected_text) {
      // 清除错误状态并重新处理
      await chrome.storage.local.set({
        'prompt_anywhere_error': null,
        'prompt_anywhere_processing': true
      });
      
      showLoadingState();
      
      // 发送消息给背景脚本重新处理
      chrome.runtime.sendMessage({
        action: 'retry',
        text: data.prompt_anywhere_selected_text
      });
    }
  } catch (error) {
    console.error('Error retrying:', error);
    showErrorState('重试失败: ' + error.message);
  }
}

// 复制响应
async function handleCopy() {
  try {
    const response = elements.responseContent.textContent;
    await navigator.clipboard.writeText(response);
    
    // 显示复制成功提示
    const originalText = elements.copyBtn.textContent;
    elements.copyBtn.textContent = '已复制！';
    elements.copyBtn.classList.add('btn-success');
    
    setTimeout(() => {
      elements.copyBtn.textContent = originalText;
      elements.copyBtn.classList.remove('btn-success');
    }, 2000);
  } catch (error) {
    console.error('Error copying text:', error);
  }
}

// 新查询
async function handleNewQuery() {
  try {
    await chrome.storage.local.clear();
    showEmptyState();
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}

// 加载设置
async function loadSettings() {
  try {
    const data = await chrome.storage.local.get('prompt_anywhere_api_config');
    if (data.prompt_anywhere_api_config) {
      const config = data.prompt_anywhere_api_config;
      elements.apiKey.value = config.apiKey || '';
      elements.model.value = config.model || 'gpt-4o';
      elements.systemPrompt.value = config.systemPrompt || 'You are a helpful assistant.';
      elements.temperature.value = config.temperature || 0.7;
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// 保存设置
async function handleSave() {
  try {
    if (!elements.apiKey.value.trim()) {
      showSettingsStatus('请输入 API Key', 'error');
      return;
    }

    const config = {
      apiKey: elements.apiKey.value.trim(),
      model: elements.model.value,
      systemPrompt: elements.systemPrompt.value,
      temperature: parseFloat(elements.temperature.value)
    };

    await chrome.storage.local.set({ 'prompt_anywhere_api_config': config });
    showSettingsStatus('设置已保存', 'success');
  } catch (error) {
    console.error('Error saving settings:', error);
    showSettingsStatus('保存失败: ' + error.message, 'error');
  }
}

// 测试连接
async function handleTest() {
  try {
    if (!elements.apiKey.value.trim()) {
      showSettingsStatus('请先输入 API Key', 'error');
      return;
    }

    elements.testBtn.textContent = '测试中...';
    elements.testBtn.disabled = true;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${elements.apiKey.value.trim()}`
      },
      body: JSON.stringify({
        model: elements.model.value,
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 5
      })
    });

    if (response.ok) {
      showSettingsStatus('API 连接成功！', 'success');
    } else if (response.status === 401) {
      showSettingsStatus('API Key 无效', 'error');
    } else if (response.status === 429) {
      showSettingsStatus('API 请求频率限制', 'error');
    } else {
      showSettingsStatus(`API 连接失败 (${response.status})`, 'error');
    }
  } catch (error) {
    console.error('Error testing API:', error);
    showSettingsStatus('连接测试失败: ' + error.message, 'error');
  } finally {
    elements.testBtn.textContent = '测试连接';
    elements.testBtn.disabled = false;
  }
}

// 显示设置状态消息
function showSettingsStatus(message, type) {
  elements.settingsStatus.innerHTML = `
    <div class="status-message status-${type}">
      ${message}
    </div>
  `;
  
  setTimeout(() => {
    elements.settingsStatus.innerHTML = '';
  }, 3000);
}

// 监听存储变化以实时更新状态
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    if (changes.prompt_anywhere_processing) {
      if (changes.prompt_anywhere_processing.newValue) {
        showLoadingState();
      }
    }
    
    if (changes.prompt_anywhere_response) {
      if (changes.prompt_anywhere_response.newValue) {
        showResponseState(changes.prompt_anywhere_response.newValue.content);
      }
    }
    
    if (changes.prompt_anywhere_error) {
      if (changes.prompt_anywhere_error.newValue) {
        showErrorState(changes.prompt_anywhere_error.newValue);
      }
    }
  }
}); 