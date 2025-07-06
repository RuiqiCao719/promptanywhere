# Deployment Guide for Prompt Anywhere Chrome Extension

## Quick Start (Without Build Process)

If you don't have Node.js installed or want to test immediately, follow these steps:

### 1. Manual Setup for Testing

1. **Update manifest.json** - Ensure the paths point to correct files:
   ```json
   {
     "background": {
       "service_worker": "src/background.js"
     },
     "action": {
       "default_popup": "dist/popup.html"
     },
     "content_scripts": [
       {
         "matches": ["<all_urls>"],
         "js": ["src/content.js"]
       }
     ]
   }
   ```

2. **Create minimal JavaScript versions**:
   - Copy TypeScript files and rename to `.js`
   - Remove TypeScript-specific syntax
   - Replace import statements with Chrome extension APIs

### 2. With Build Process (Recommended)

#### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

#### Installation & Build
```bash
# Navigate to project directory
cd promptanywhere

# Install dependencies
npm install

# Build for development (with watch)
npm run dev

# Build for production
npm run build
```

#### Load Extension in Chrome
1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `promptanywhere` folder
6. Extension should appear in your extensions list

## Architecture Summary

### Clean Architecture Implementation

The project follows Clean Architecture principles with these layers:

1. **Domain Layer** (`src/domain/`):
   - `entities/`: Core business objects (PromptRequest, ApiConfig)
   - `repositories/`: Abstract interfaces for data access
   - `use-cases/`: Business logic and rules

2. **Application Layer** (`src/application/`):
   - `controllers/`: Application orchestration
   - `dependency-injection.ts`: IoC container

3. **Infrastructure Layer** (`src/infrastructure/`):
   - `repositories/`: Concrete implementations
   - Chrome storage and OpenAI API integrations

4. **Presentation Layer**:
   - `background.ts`: Service worker
   - `content.ts`: Content script
   - `popup.ts`: UI controller
   - `popup.html`: User interface

### Key Benefits of This Architecture

1. **Testability**: Business logic is isolated and testable
2. **Maintainability**: Clear separation of concerns
3. **Extensibility**: Easy to add new features
4. **Independence**: UI changes don't affect business logic

## File Structure

```
promptanywhere/
├── manifest.json              # Chrome extension configuration
├── package.json              # Node.js dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # TailwindCSS configuration
├── .gitignore                # Git ignore rules
├── README.md                 # Main documentation
├── DEPLOYMENT.md             # This file
├── src/                      # Source code
│   ├── domain/               # Business logic layer
│   │   ├── entities/
│   │   │   ├── api-config.ts
│   │   │   └── prompt-request.ts
│   │   ├── repositories/
│   │   │   ├── openai-repository.ts
│   │   │   └── storage-repository.ts
│   │   └── use-cases/
│   │       ├── manage-api-config.ts
│   │       └── process-text-prompt.ts
│   ├── application/          # Application layer
│   │   ├── controllers/
│   │   │   ├── config-controller.ts
│   │   │   └── prompt-controller.ts
│   │   └── dependency-injection.ts
│   ├── infrastructure/       # Infrastructure layer
│   │   └── repositories/
│   │       ├── chrome-storage-repository.ts
│   │       └── openai-api-repository.ts
│   ├── styles/
│   │   └── input.css
│   ├── background.ts         # Service worker
│   ├── content.ts           # Content script
│   └── popup.ts             # Popup controller
├── dist/                    # Build output
│   ├── popup.html          # Main UI
│   └── styles/
│       └── output.css      # Generated CSS
└── assets/                 # Static assets
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Production Deployment

### 1. Prepare for Chrome Web Store

1. **Create proper icons** (replace placeholder files):
   - 16x16, 48x48, 128x128 PNG icons
   - Use consistent branding and clear visibility

2. **Update manifest.json**:
   - Add proper description
   - Add homepage_url
   - Review permissions

3. **Build production version**:
   ```bash
   npm run build
   ```

4. **Create ZIP package**:
   ```bash
   zip -r prompt-anywhere-v1.0.0.zip . -x "node_modules/*" "src/*" ".git/*" "*.md"
   ```

### 2. Chrome Web Store Submission

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Pay one-time $5 developer fee (if first submission)
3. Upload ZIP file
4. Fill in store listing details
5. Submit for review

### 3. Enterprise Deployment

For enterprise deployment:
1. Host the extension on internal servers
2. Use Chrome's ExtensionInstallForcelist policy
3. Deploy through Group Policy or Mobile Device Management

## Testing Checklist

Before deployment, verify:

- [ ] Extension loads without errors
- [ ] Right-click context menu appears on text selection
- [ ] API key can be saved and tested
- [ ] GPT-4o responses are displayed correctly
- [ ] Copy functionality works
- [ ] Error handling works for invalid API keys
- [ ] Settings panel navigation works
- [ ] Extension works on different websites
- [ ] No console errors in Chrome DevTools

## Troubleshooting

### Common Build Issues

1. **TypeScript errors**: 
   - Check `tsconfig.json` configuration
   - Ensure all imports use correct paths

2. **CSS not generating**:
   - Verify TailwindCSS configuration
   - Check input.css file exists

3. **Chrome API errors**:
   - Verify manifest.json permissions
   - Check service worker registration

### Runtime Issues

1. **Context menu not appearing**:
   - Ensure text is selected
   - Check background script console for errors

2. **API calls failing**:
   - Verify API key is valid
   - Check network connectivity
   - Review Chrome console for CORS errors

3. **Popup not opening**:
   - Check popup.html path in manifest
   - Verify popup.js is loaded correctly

## Security Considerations

1. **API Key Storage**: 
   - Keys stored in Chrome's encrypted local storage
   - Never transmitted except to OpenAI API

2. **Content Security Policy**:
   - Manifest V3 enforces strict CSP
   - No inline scripts or eval()

3. **Permissions**:
   - Minimal permissions requested
   - Host permissions only for OpenAI API

## Performance Optimization

1. **Lazy Loading**: Dependencies loaded only when needed
2. **Background Processing**: API calls don't block UI
3. **Efficient Storage**: Minimal data persistence
4. **Error Recovery**: Graceful handling of failures

## Monitoring and Analytics

Consider adding:
1. Error reporting (without sending sensitive data)
2. Usage analytics (anonymized)
3. Performance monitoring
4. User feedback collection

## Future Enhancements

The clean architecture makes it easy to add:
1. Multiple AI model support
2. Custom prompt templates
3. Response history
4. Keyboard shortcuts
5. Bulk text processing 