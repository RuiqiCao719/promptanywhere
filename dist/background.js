// Prompt Anywhere 背景脚本 - 简化版

// 插件安装时的初始化
chrome.runtime.onInstalled.addListener(() => {
  console.log('Prompt Anywhere extension installed!');
  
  // 可以在这里设置默认配置
  chrome.storage.local.get('prompt_anywhere_api_config').then((result) => {
    if (!result.prompt_anywhere_api_config) {
      chrome.storage.local.set({
        'prompt_anywhere_api_config': {
          model: 'gpt-4o',
          systemPrompt: '你是一个有用的助手，请根据用户提供的文本和问题给出准确、有用的回答。',
          temperature: 0.7
        }
      });
    }
  });
});

// 处理来自 content script 的消息（如果需要的话）
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openSettings') {
    // 打开设置页面
    chrome.action.openPopup();
    sendResponse({ success: true });
  }
  
  return true; // 保持消息通道开放
}); 