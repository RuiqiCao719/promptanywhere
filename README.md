# Prompt Anywhere

A Chrome extension that allows you to ask GPT-4o about any selected text on any webpage using the right-click context menu.

## Features

- 🎯 **Right-click to Ask**: Select any text and right-click to send it to GPT-4o
- 🔒 **Secure API Key Storage**: Your OpenAI API key is stored locally and never shared
- 💬 **Beautiful UI**: Clean, modern interface with TailwindCSS
- ⚡ **Fast Processing**: Background processing with visual feedback
- 📋 **Copy Response**: Easy copy-to-clipboard functionality
- 🧪 **API Key Testing**: Test your API key before saving

## Architecture

This project implements **Clean Architecture** principles:

```
src/
├── domain/                 # Business logic (entities, use cases, interfaces)
│   ├── entities/          # Core business objects
│   ├── repositories/      # Abstract interfaces
│   └── use-cases/         # Business logic
├── application/           # Application layer (controllers, dependency injection)
│   └── controllers/       # Application controllers
├── infrastructure/       # External concerns (API calls, storage)
│   └── repositories/     # Concrete implementations
└── presentation/         # UI layer (popup, content scripts)
```

### Architecture Benefits

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Testability**: Business logic is independent of external dependencies
3. **Maintainability**: Changes in one layer don't affect others
4. **Extensibility**: Easy to add new features or change implementations

## Tech Stack

- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **Chrome Extensions Manifest V3**: Latest Chrome extension APIs
- **OpenAI API**: GPT-4o model integration

## Setup Instructions

### 1. Install Dependencies

```bash
cd promptanywhere
npm install
```

### 2. Build the Extension

```bash
# Development build with watch
npm run dev

# Production build
npm run build
```

### 3. Add Icons (Optional)

Replace the placeholder icon files in the `assets/` directory:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels) 
- `icon128.png` (128x128 pixels)

### 4. Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `promptanywhere` folder
5. The extension should now appear in your extensions list

### 5. Configure API Key

1. Click the extension icon in the toolbar
2. Click "Setup API Key" or the settings gear icon
3. Enter your OpenAI API key (get one from https://platform.openai.com/api-keys)
4. Click "Test" to verify the key works
5. Click "Save" to store it locally

## Usage

1. **Select Text**: Highlight any text on any webpage
2. **Right-click**: Choose "Ask GPT-4o" from the context menu
3. **View Response**: The extension popup will show GPT-4o's response
4. **Copy Result**: Click "Copy" to copy the response to clipboard

## Development

### Project Structure

```
promptanywhere/
├── manifest.json          # Chrome extension manifest
├── package.json          # Node.js dependencies
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # TailwindCSS configuration
├── src/                  # Source code
│   ├── domain/           # Domain layer (Clean Architecture)
│   ├── application/      # Application layer
│   ├── infrastructure/   # Infrastructure layer
│   ├── background.ts     # Service worker
│   ├── content.ts        # Content script
│   ├── popup.ts          # Popup script
│   └── styles/           # CSS files
├── dist/                 # Built files
└── assets/               # Static assets
```

### Build Process

1. **TypeScript Compilation**: `src/` → `dist/`
2. **CSS Processing**: TailwindCSS processes `src/styles/input.css` → `dist/styles/output.css`
3. **File Copying**: HTML and other assets are copied to `dist/`

### Clean Architecture Layers

1. **Domain Layer** (`src/domain/`):
   - Contains business entities and rules
   - Independent of external frameworks
   - Defines repository interfaces

2. **Application Layer** (`src/application/`):
   - Contains use case orchestration
   - Dependency injection container
   - Application controllers

3. **Infrastructure Layer** (`src/infrastructure/`):
   - Implements domain interfaces
   - Handles external API calls
   - Chrome storage implementation

4. **Presentation Layer**:
   - Chrome extension UI (popup, background, content scripts)
   - User interaction handling

## Security

- API keys are stored in Chrome's local storage (encrypted by Chrome)
- No data is sent to external servers except OpenAI API
- All communication uses HTTPS
- API key is never logged or exposed

## Error Handling

The extension includes comprehensive error handling:
- Network errors
- Invalid API keys
- API rate limiting
- Malformed responses
- Storage errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow Clean Architecture principles
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Troubleshooting

### Common Issues

1. **"API key not configured"**: Go to settings and add your OpenAI API key
2. **"Network error"**: Check your internet connection and API key validity
3. **Context menu not appearing**: Make sure you've selected text before right-clicking
4. **Extension not loading**: Check Chrome's extension page for error messages

### Development Issues

1. **TypeScript errors**: Run `npm run build:ts` to see detailed errors
2. **CSS not updating**: Run `npm run build:css` to rebuild styles
3. **Chrome API errors**: Check that manifest.json permissions are correct

## API Usage

The extension uses OpenAI's Chat Completions API:

```typescript
POST https://api.openai.com/v1/chat/completions
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "model": "gpt-4o",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Selected text here"}
  ],
  "temperature": 0.7
}
```