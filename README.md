# Prompt Anywhere - 随时随地用gpt
Email me: ruiqi719@outlook.com
[English](#english) | [中文](#中文)

---

## 中文

### 📖 简介

Prompt Anywhere 是一个智能的Chrome浏览器扩展，通过悬浮球的形式为用户提供便捷的AI助手服务。只需选中网页上的任意文本，即可快速调用GPT-4o进行总结、翻译、解释等操作。

### ✨ 主要特性

- 🎯 **智能悬浮球**：页面右下角的AI悬浮球，不干扰正常浏览
- 🔄 **自动响应**：选中文本后自动弹出对话窗口
- 🎨 **现代化界面**：渐变设计，流畅动画效果
- 🌐 **双语支持**：中文/英文界面随时切换
- 🖱️ **可拖拽窗口**：支持拖拽移动，位置记忆
- ⌨️ **快捷操作**：Ctrl+Enter发送，ESC关闭
- 📋 **一键复制**：AI回答一键复制到剪贴板
- ⚙️ **灵活设置**：支持模型选择、温度调节等

### 🚀 快速开始

#### 安装步骤

1. 下载或克隆此仓库
2. 打开Chrome浏览器，访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目中的 `dist` 文件夹

#### 配置API

1. 点击扩展图标打开设置弹窗
2. 切换到"设置"标签页
3. 输入您的OpenAI API Key（以sk-开头）
4. 点击"测试连接"验证API可用性
5. 点击"保存设置"

### 🎯 使用方法

#### 悬浮球模式

**默认状态**：
- 页面右下角显示蓝色"AI"悬浮球
- 悬浮球始终存在，不影响正常浏览

**选中文本后**：
1. 选中任何文本（超过3个字符）
2. 悬浮球变为绿色并显示"✨"图标
3. 自动弹出AI助手窗口
4. 在输入框中描述需求，例如：
   - "总结这段内容"
   - "翻译成英文"
   - "解释这个概念"

**手动使用**：
- 随时点击悬浮球打开AI助手
- 即使没有选中文本也可以使用

#### 界面操作

- **⚙️ 设置按钮**：打开设置面板，切换语言
- **− 最小化按钮**：隐藏窗口但保持状态
- **拖拽标题栏**：移动窗口位置
- **× 清空按钮**：分别清空选中文本或问题

### 🔧 高级功能

- **模型选择**：GPT-4o（推荐）、GPT-4、GPT-3.5
- **创造性调节**：0（严谨）到1（创意）
- **系统提示**：自定义AI的回答风格
- **语言切换**：中文/英文界面实时切换

### 📁 文件结构

```
promptanywhere/
├── dist/                   # 扩展文件
│   ├── manifest.json      # 扩展配置
│   ├── background.js      # 后台脚本
│   ├── content.js         # 内容脚本
│   ├── content.css        # 样式文件
│   ├── popup.html         # 弹窗界面
│   ├── popup.js           # 弹窗逻辑
│   └── icon.svg           # 图标文件
├── README.md              # 说明文档
└── .gitignore             # Git忽略文件
```

### 🔧 故障排除

**悬浮球不显示**：
- 刷新页面重试
- 检查扩展是否启用

**选中文本无反应**：
- 确保文本超过3个字符
- 避免在框架页面内选择

**API调用失败**：
- 检查API Key是否正确
- 确认网络连接正常
- 验证API余额充足

### 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 📄 许可证

MIT License

---

## English

### 📖 Introduction

Prompt Anywhere is an intelligent Chrome browser extension that provides convenient AI assistant services through a floating ball interface. Simply select any text on a webpage to quickly invoke GPT-4o for summarization, translation, explanation, and other operations.

### ✨ Key Features

- 🎯 **Smart Floating Ball**: AI floating ball in the bottom-right corner that doesn't interfere with normal browsing
- 🔄 **Auto Response**: Automatically pops up dialog window after text selection
- 🎨 **Modern Interface**: Gradient design with smooth animation effects
- 🌐 **Bilingual Support**: Switch between Chinese/English interface anytime
- 🖱️ **Draggable Window**: Support drag-to-move with position memory
- ⌨️ **Quick Operations**: Ctrl+Enter to send, ESC to close
- 📋 **One-click Copy**: Copy AI responses to clipboard with one click
- ⚙️ **Flexible Settings**: Support model selection, temperature adjustment, etc.

### 🚀 Quick Start

#### Installation Steps

1. Download or clone this repository
2. Open Chrome browser and visit `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked"
5. Select the `dist` folder in the project

#### API Configuration

1. Click the extension icon to open settings popup
2. Switch to "Settings" tab
3. Enter your OpenAI API Key (starting with sk-)
4. Click "Test Connection" to verify API availability
5. Click "Save Settings"

### 🎯 Usage

#### Floating Ball Mode

**Default State**:
- Blue "AI" floating ball appears in bottom-right corner
- Floating ball always exists without interfering with normal browsing

**After Text Selection**:
1. Select any text (more than 3 characters)
2. Floating ball turns green and shows "✨" icon
3. AI assistant window pops up automatically
4. Describe your needs in the input box, e.g.:
   - "Summarize this content"
   - "Translate to Chinese"
   - "Explain this concept"

**Manual Usage**:
- Click floating ball anytime to open AI assistant
- Can be used even without selected text

#### Interface Operations

- **⚙️ Settings Button**: Open settings panel, switch language
- **− Minimize Button**: Hide window but keep state
- **Drag Title Bar**: Move window position
- **× Clear Buttons**: Clear selected text or question separately

### 🔧 Advanced Features

- **Model Selection**: GPT-4o (recommended), GPT-4, GPT-3.5
- **Creativity Adjustment**: 0 (precise) to 1 (creative)
- **System Prompt**: Customize AI response style
- **Language Switch**: Real-time Chinese/English interface switching

### 📁 File Structure

```
promptanywhere/
├── dist/                   # Extension files
│   ├── manifest.json      # Extension configuration
│   ├── background.js      # Background script
│   ├── content.js         # Content script
│   ├── content.css        # Style file
│   ├── popup.html         # Popup interface
│   ├── popup.js           # Popup logic
│   └── icon.svg           # Icon file
├── README.md              # Documentation
└── .gitignore             # Git ignore file
```

### 🔧 Troubleshooting

**Floating ball not showing**:
- Refresh page and retry
- Check if extension is enabled

**No response to text selection**:
- Ensure text is more than 3 characters
- Avoid selecting within frame pages

**API call failure**:
- Check if API Key is correct
- Confirm network connection is normal
- Verify API balance is sufficient

### 🤝 Contributing

Issues and Pull Requests are welcome!

### 📄 License

MIT License

---

## 📸 Screenshots

### 悬浮球界面 / Floating Ball Interface
![Floating Ball](https://via.placeholder.com/400x300/667eea/ffffff?text=Floating+Ball+Interface)

### 对话窗口 / Dialog Window
![Dialog Window](https://via.placeholder.com/400x300/667eea/ffffff?text=Dialog+Window)

### 设置面板 / Settings Panel
![Settings Panel](https://via.placeholder.com/400x300/667eea/ffffff?text=Settings+Panel)

---

## 🔗 相关链接 / Related Links

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Chrome Extension Developer Guide](https://developer.chrome.com/docs/extensions/)
- [Issues & Bug Reports](https://github.com/yourusername/promptanywhere/issues)

---

**Made with ❤️ by Ruiqi**