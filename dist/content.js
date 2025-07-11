// Prompt Anywhere Content Script - 悬浮球版本
// 处理页面上的文本选择和悬浮窗显示

class PromptAnywhereFloating {
    constructor() {
        this.floatBall = null;
        this.modal = null;
        this.selectedText = '';
        this.isProcessing = false;
        this.currentResponse = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.currentLanguage = 'zh'; // 默认中文
        
        // 国际化文本
        this.i18n = {
            zh: {
                ai_assistant: 'AI助手',
                drag_hint: '拖拽移动',
                selected_text: '选中的文本:',
                your_question: '你的问题 (Ctrl+Enter发送):',
                placeholder_text: '例如：总结、翻译、解释...',
                send: '发送',
                clear_question: '清空问题',
                settings: '设置',
                language: '语言:',
                processing: '处理中...',
                copy: '复制',
                copied: '已复制！',
                new_question: '新问题',
                retry: '重试',
                please_input: '请输入你的问题或指令',
                please_select: '请先选择一段文本',
                config_api: '请先配置 OpenAI API Key\n\n点击扩展图标进入设置'
            },
            en: {
                ai_assistant: 'AI Assistant',
                drag_hint: 'Drag to move',
                selected_text: 'Selected text:',
                your_question: 'Your question (Ctrl+Enter to send):',
                placeholder_text: 'e.g.: summarize, translate, explain...',
                send: 'Send',
                clear_question: 'Clear Question',
                settings: 'Settings',
                language: 'Language:',
                processing: 'Processing...',
                copy: 'Copy',
                copied: 'Copied!',
                new_question: 'New Question',
                retry: 'Retry',
                please_input: 'Please enter your question or instruction',
                please_select: 'Please select some text first',
                config_api: 'Please configure OpenAI API Key first\n\nClick the extension icon to enter settings'
            }
        };
        
        this.init();
    }

    async init() {
        await this.loadLanguageSettings();
        this.createFloatBall();
        this.createModal();
        this.bindEvents();
        this.updateLanguage();
    }

    // 加载语言设置
    async loadLanguageSettings() {
        try {
            const result = await chrome.storage.local.get('prompt_anywhere_language');
            if (result.prompt_anywhere_language) {
                this.currentLanguage = result.prompt_anywhere_language;
            }
        } catch (error) {
            console.log('Language settings not found, using default');
        }
    }

    // 保存语言设置
    async saveLanguageSettings() {
        try {
            await chrome.storage.local.set({
                prompt_anywhere_language: this.currentLanguage
            });
        } catch (error) {
            console.error('Failed to save language settings:', error);
        }
    }

    // 更新界面语言
    updateLanguage() {
        const texts = this.i18n[this.currentLanguage];
        
        // 更新所有带有 data-i18n 属性的元素
        this.modal.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (texts[key]) {
                element.textContent = texts[key];
            }
        });
        
        // 更新 placeholder
        const textarea = this.modal.querySelector('#prompt-anywhere-user-prompt');
        if (textarea) {
            textarea.placeholder = texts.placeholder_text;
        }
        
        // 更新语言选择器
        const languageSelect = this.modal.querySelector('#prompt-anywhere-language-select');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
        }
    }

    // 获取当前语言的文本
    getText(key) {
        return this.i18n[this.currentLanguage][key] || key;
    }

    // 创建悬浮球
    createFloatBall() {
        this.floatBall = document.createElement('div');
        this.floatBall.className = 'prompt-anywhere-float-ball';
        this.floatBall.innerHTML = `
            <div class="prompt-anywhere-float-ball-icon">AI</div>
        `;
        
        document.body.appendChild(this.floatBall);
    }

    // 创建悬浮窗HTML结构
    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'prompt-anywhere-modal';
        
        this.modal.innerHTML = `
            <div class="prompt-anywhere-header">
                <div class="prompt-anywhere-title">
                    <span data-i18n="ai_assistant">AI助手</span>
                    <span class="prompt-anywhere-drag-hint" data-i18n="drag_hint">拖拽移动</span>
                </div>
                <div class="prompt-anywhere-controls">
                    <button class="prompt-anywhere-settings" title="设置">⚙️</button>
                    <button class="prompt-anywhere-minimize" title="最小化">−</button>
                </div>
            </div>
            <div class="prompt-anywhere-content">
                <div class="prompt-anywhere-selected-text">
                    <div class="prompt-anywhere-selected-text-label">
                        <span data-i18n="selected_text">选中的文本:</span>
                        <button id="prompt-anywhere-clear-selected" class="prompt-anywhere-clear-btn" title="清空选中文本">×</button>
                    </div>
                    <div id="prompt-anywhere-selected-text-content"></div>
                </div>
                
                <div class="prompt-anywhere-form-group">
                    <label class="prompt-anywhere-label" data-i18n="your_question">你的问题 (Ctrl+Enter发送):</label>
                    <textarea 
                        id="prompt-anywhere-user-prompt" 
                        class="prompt-anywhere-textarea" 
                        data-i18n-placeholder="placeholder_text"
                        placeholder="例如：总结、翻译、解释..."
                    ></textarea>
                </div>
                
                <div class="prompt-anywhere-buttons">
                    <button id="prompt-anywhere-submit" class="prompt-anywhere-btn prompt-anywhere-btn-primary" data-i18n="send">
                        发送
                    </button>
                    <button id="prompt-anywhere-clear-prompt" class="prompt-anywhere-btn prompt-anywhere-btn-secondary" data-i18n="clear_question">
                        清空问题
                    </button>
                </div>
                
                <div id="prompt-anywhere-result" style="display: none;"></div>
            </div>
            
            <!-- 设置面板 -->
            <div id="prompt-anywhere-settings-panel" class="prompt-anywhere-settings-panel" style="display: none;">
                <div class="prompt-anywhere-settings-header">
                    <h3 data-i18n="settings">设置</h3>
                    <button class="prompt-anywhere-settings-close">×</button>
                </div>
                <div class="prompt-anywhere-settings-content">
                    <div class="prompt-anywhere-setting-item">
                        <label data-i18n="language">语言:</label>
                        <select id="prompt-anywhere-language-select">
                            <option value="zh">中文</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.modal);
    }

    // 绑定事件
    bindEvents() {
        // 文本选择事件
        document.addEventListener('mouseup', (e) => this.handleTextSelection(e));
        document.addEventListener('keyup', (e) => this.handleTextSelection(e));
        
        // 悬浮球点击事件
        this.floatBall.addEventListener('click', () => this.toggleModal());
        
        // 模态框事件
        this.modal.querySelector('.prompt-anywhere-minimize').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.minimizeModal();
        });
        this.modal.querySelector('.prompt-anywhere-settings').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.toggleSettings();
        });
        this.modal.querySelector('#prompt-anywhere-submit').addEventListener('click', () => this.handleSubmit());
        this.modal.querySelector('#prompt-anywhere-clear-prompt').addEventListener('click', () => this.clearPrompt());
        this.modal.querySelector('#prompt-anywhere-clear-selected').addEventListener('click', () => this.clearSelectedText());
        
        // 拖拽事件 - 只在标题区域允许拖拽，但排除按钮
        const header = this.modal.querySelector('.prompt-anywhere-header');
        header.addEventListener('mousedown', (e) => {
            // 如果点击的是按钮区域，不启动拖拽
            if (e.target.closest('.prompt-anywhere-controls')) {
                return;
            }
            this.startDrag(e);
        });
        document.addEventListener('mousemove', (e) => this.onDrag(e));
        document.addEventListener('mouseup', () => this.endDrag());
        
        // 文本框键盘事件
        const textarea = this.modal.querySelector('#prompt-anywhere-user-prompt');
        textarea.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.handleSubmit();
            }
        });
        
        // 阻止模态框内部点击关闭
        this.modal.addEventListener('click', (e) => e.stopPropagation());
        
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalVisible()) {
                this.minimizeModal();
            }
        });
        
        // 设置面板事件
        this.modal.querySelector('.prompt-anywhere-settings-close').addEventListener('click', () => this.hideSettings());
        this.modal.querySelector('#prompt-anywhere-language-select').addEventListener('change', (e) => this.changeLanguage(e.target.value));
    }

    // 开始拖拽
    startDrag(e) {
        this.isDragging = true;
        this.modal.classList.add('dragging');
        
        const rect = this.modal.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;
        
        e.preventDefault();
    }

    // 拖拽中
    onDrag(e) {
        if (!this.isDragging) return;
        
        const x = e.clientX - this.dragOffset.x;
        const y = e.clientY - this.dragOffset.y;
        
        // 限制在窗口范围内
        const maxX = window.innerWidth - this.modal.offsetWidth;
        const maxY = window.innerHeight - this.modal.offsetHeight;
        
        const constrainedX = Math.max(0, Math.min(x, maxX));
        const constrainedY = Math.max(0, Math.min(y, maxY));
        
        this.modal.style.left = constrainedX + 'px';
        this.modal.style.top = constrainedY + 'px';
        this.modal.style.transform = 'none';
    }

    // 结束拖拽
    endDrag() {
        if (this.isDragging) {
            this.isDragging = false;
            this.modal.classList.remove('dragging');
        }
    }

    // 处理文本选择
    handleTextSelection(e) {
        // 避免在模态框内触发
        if (this.isModalVisible() || e.target.closest('.prompt-anywhere-modal') || e.target.closest('.prompt-anywhere-float-ball')) {
            return;
        }

        setTimeout(() => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            
            if (selectedText && selectedText.length > 3) {
                this.selectedText = selectedText;
                this.floatBall.classList.add('has-selection');
                this.floatBall.querySelector('.prompt-anywhere-float-ball-icon').textContent = '✨';
                
                // 自动显示模态框
                this.showModal();
            } else {
                this.floatBall.classList.remove('has-selection');
                this.floatBall.querySelector('.prompt-anywhere-float-ball-icon').textContent = 'AI';
            }
        }, 100);
    }

    // 切换模态框显示
    toggleModal() {
        if (this.isModalVisible()) {
            this.hideModal();
        } else {
            this.showModal();
        }
    }

    // 显示模态框
    showModal() {
        // 如果有选中的文本，设置到界面
        if (this.selectedText) {
            const textContent = this.modal.querySelector('#prompt-anywhere-selected-text-content');
            textContent.textContent = this.selectedText;
        }
        
        // 设置模态框位置 - 从悬浮球附近展开
        this.positionModalNearFloatBall();
        
        // 清空之前的输入和结果
        const userPrompt = this.modal.querySelector('#prompt-anywhere-user-prompt');
        if (!userPrompt.value.trim()) {
            userPrompt.value = '';
        }
        
        const result = this.modal.querySelector('#prompt-anywhere-result');
        if (!this.currentResponse) {
            result.style.display = 'none';
            result.innerHTML = '';
        }
        
        // 显示模态框
        this.modal.classList.add('show');
        
        // 聚焦到文本框
        setTimeout(() => {
            userPrompt.focus();
        }, 100);
    }

    // 将模态框定位在悬浮球附近
    positionModalNearFloatBall() {
        const ballRect = this.floatBall.getBoundingClientRect();
        const modalWidth = 380;
        const modalHeight = Math.min(500, window.innerHeight * 0.8);
        
        // 计算位置 - 让窗口与悬浮球更加贴近，几乎重叠
        let left = ballRect.right - modalWidth + 50; // 让窗口右边缘几乎与悬浮球重叠
        let top = ballRect.top - 5; // 与悬浮球顶部几乎对齐
        
        // 如果窗口会超出右边界，则向左调整
        const availableRightSpace = window.innerWidth - ballRect.right;
        if (availableRightSpace < modalWidth - 50) {
            // 右侧空间不够，放到悬浮球左侧
            left = ballRect.left - modalWidth + 10; // 让左边缘几乎贴着悬浮球
        }
        
        // 确保不会超出屏幕边界
        if (left < 5) {
            left = 5;
        }
        if (left + modalWidth > window.innerWidth - 5) {
            left = window.innerWidth - modalWidth - 5;
        }
        
        // 垂直位置调整 - 确保不超出屏幕
        if (top + modalHeight > window.innerHeight - 5) {
            top = window.innerHeight - modalHeight - 5;
        }
        if (top < 5) {
            top = 5;
        }
        
        // 应用位置
        this.modal.style.left = left + 'px';
        this.modal.style.top = top + 'px';
        this.modal.style.transform = 'scale(1)';
    }

    // 最小化模态框（返回悬浮球状态）
    minimizeModal() {
        this.hideModal();
    }

    // 关闭模态框（返回悬浮球状态，清除选择）
    closeModal() {
        this.hideModal();
        
        // 清除文本选择状态
        this.selectedText = '';
        this.floatBall.classList.remove('has-selection');
        this.floatBall.querySelector('.prompt-anywhere-float-ball-icon').textContent = 'AI';
        
        // 清除页面文本选择
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    }

    // 隐藏模态框
    hideModal() {
        this.modal.classList.remove('show');
    }

    // 检查模态框是否可见
    isModalVisible() {
        return this.modal.classList.contains('show');
    }

    // 清空输入
    clearInput() {
        // 清空问题输入框
        const userPrompt = this.modal.querySelector('#prompt-anywhere-user-prompt');
        userPrompt.value = '';
        userPrompt.focus();
        
        // 清空结果显示
        const result = this.modal.querySelector('#prompt-anywhere-result');
        result.style.display = 'none';
        result.innerHTML = '';
        this.currentResponse = null;
    }

    // 处理提交
    async handleSubmit() {
        const userPrompt = this.modal.querySelector('#prompt-anywhere-user-prompt').value.trim();
        
        if (!userPrompt) {
            this.showError(this.getText('please_input'));
            return;
        }

        if (!this.selectedText) {
            this.showError(this.getText('please_select'));
            return;
        }

        // 检查API配置
        try {
            const config = await chrome.storage.local.get('prompt_anywhere_api_config');
            if (!config.prompt_anywhere_api_config || !config.prompt_anywhere_api_config.apiKey) {
                this.showError(this.getText('config_api'));
                return;
            }

            await this.processRequest(userPrompt, config.prompt_anywhere_api_config);
        } catch (error) {
            console.error('Error:', error);
            this.showError(error.message);
        }
    }

    // 处理API请求
    async processRequest(userPrompt, config) {
        this.isProcessing = true;
        this.showLoading();
        
        try {
            // 构建完整的prompt
            const fullPrompt = `基于以下文本：\n\n"${this.selectedText}"\n\n${userPrompt}`;
            
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify({
                    model: config.model || 'gpt-4o',
                    messages: [
                        { 
                            role: 'system', 
                            content: config.systemPrompt || '你是一个有用的助手，请根据用户提供的文本和问题给出准确、有用的回答。'
                        },
                        { role: 'user', content: fullPrompt }
                    ],
                    temperature: config.temperature || 0.7
                })
            });

            if (!response.ok) {
                throw new Error(this.getApiErrorMessage(response.status));
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(`OpenAI API 错误: ${data.error.message}`);
            }

            if (!data.choices || data.choices.length === 0) {
                throw new Error('API 返回了空响应');
            }

            this.currentResponse = data.choices[0].message.content;
            this.showResponse(this.currentResponse);
            
        } catch (error) {
            console.error('API Error:', error);
            this.showError(error.message);
        } finally {
            this.isProcessing = false;
        }
    }

    // 显示加载状态
    showLoading() {
        const result = this.modal.querySelector('#prompt-anywhere-result');
        result.style.display = 'block';
        result.innerHTML = `
            <div class="prompt-anywhere-loading">
                <div class="prompt-anywhere-spinner"></div>
                <div>${this.getText('processing')}</div>
            </div>
        `;
        
        // 禁用提交按钮
        const submitBtn = this.modal.querySelector('#prompt-anywhere-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = this.getText('processing');
    }

    // 显示响应
    showResponse(response) {
        const result = this.modal.querySelector('#prompt-anywhere-result');
        result.innerHTML = `
            <div class="prompt-anywhere-response">${response}</div>
            <div class="prompt-anywhere-response-actions">
                <button id="prompt-anywhere-copy" class="prompt-anywhere-btn prompt-anywhere-btn-secondary">
                    ${this.getText('copy')}
                </button>
                <button id="prompt-anywhere-new-query" class="prompt-anywhere-btn prompt-anywhere-btn-secondary">
                    ${this.getText('new_question')}
                </button>
            </div>
        `;
        
        // 绑定新按钮事件
        result.querySelector('#prompt-anywhere-copy').addEventListener('click', () => this.copyResponse());
        result.querySelector('#prompt-anywhere-new-query').addEventListener('click', () => this.clearInput());
        
        // 恢复提交按钮
        this.resetSubmitButton();
    }

    // 显示错误
    showError(error) {
        const result = this.modal.querySelector('#prompt-anywhere-result');
        result.style.display = 'block';
        result.innerHTML = `
            <div class="prompt-anywhere-error">
                ${error}
            </div>
            <div class="prompt-anywhere-response-actions">
                <button id="prompt-anywhere-retry" class="prompt-anywhere-btn prompt-anywhere-btn-primary">
                    ${this.getText('retry')}
                </button>
            </div>
        `;
        
        // 绑定重试按钮
        result.querySelector('#prompt-anywhere-retry').addEventListener('click', () => this.handleSubmit());
        
        // 恢复提交按钮
        this.resetSubmitButton();
    }

    // 复制响应
    async copyResponse() {
        try {
            await navigator.clipboard.writeText(this.currentResponse);
            
            const copyBtn = this.modal.querySelector('#prompt-anywhere-copy');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = this.getText('copied');
            copyBtn.style.background = '#10b981';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '';
            }, 2000);
        } catch (error) {
            console.error('Copy failed:', error);
        }
    }

    // 重置提交按钮
    resetSubmitButton() {
        const submitBtn = this.modal.querySelector('#prompt-anywhere-submit');
        submitBtn.disabled = false;
        submitBtn.textContent = this.getText('send');
    }

    // 获取API错误信息
    getApiErrorMessage(status) {
        switch (status) {
            case 401:
                return 'API Key 无效，请检查你的 OpenAI API Key';
            case 429:
                return 'API 请求频率限制，请稍后再试';
            case 500:
                return 'OpenAI 服务器错误，请稍后再试';
            case 503:
                return 'OpenAI 服务暂时不可用，请稍后再试';
            default:
                return `API 请求失败 (状态码: ${status})`;
        }
    }

    // 清空问题
    clearPrompt() {
        this.clearInput();
    }

    // 清空选中的文本
    clearSelectedText() {
        // 清空界面显示的选中文本
        const textContent = this.modal.querySelector('#prompt-anywhere-selected-text-content');
        textContent.textContent = '';
        
        // 重置选中文本状态
        this.selectedText = '';
        this.floatBall.classList.remove('has-selection');
        this.floatBall.querySelector('.prompt-anywhere-float-ball-icon').textContent = 'AI';
        
        // 清除页面文本选择
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    }

    // 切换设置面板显示
    toggleSettings() {
        const settingsPanel = this.modal.querySelector('#prompt-anywhere-settings-panel');
        if (settingsPanel.style.display === 'none') {
            settingsPanel.style.display = 'block';
        } else {
            settingsPanel.style.display = 'none';
        }
    }

    // 隐藏设置面板
    hideSettings() {
        const settingsPanel = this.modal.querySelector('#prompt-anywhere-settings-panel');
        settingsPanel.style.display = 'none';
    }

    // 更改语言
    changeLanguage(language) {
        this.currentLanguage = language;
        this.updateLanguage();
        this.saveLanguageSettings();
    }
}

// 初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PromptAnywhereFloating();
    });
} else {
    new PromptAnywhereFloating();
} 