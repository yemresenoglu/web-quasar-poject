# Quasar Desktop Application

A modern desktop application built with Quasar Framework, Vue.js 3, and Electron featuring advanced tab management and WebView caching.

## 🚀 Features

### Core Features
- **Hybrid Content System**: Seamless switching between internal Vue pages and external web content
- **WebView Caching**: Persistent state for external tabs (YouTube videos continue playing after tab switches)
- **Advanced Tab Management**: Dual tab system with visual indicators for internal/external content
- **Dynamic Theming**: AI-powered theme generation with wallpaper integration
- **Responsive Design**: Adapts to different screen sizes and panel configurations

### Business Modules
- **Dashboard Analytics**: Real-time charts and data visualization
- **Damage Management**: Complete workflow for damage reporting and tracking
- **Document Management**: File organization and processing
- **User Account System**: Authentication and profile management

## 🏗️ Architecture

### Clean Code Principles
- **Separation of Concerns**: Clear distinction between UI, business logic, and data layers
- **Single Responsibility**: Each component and store has a focused purpose
- **Dependency Injection**: Composables pattern for state management
- **Error Handling**: Comprehensive error boundaries and fallback mechanisms

### State Management
```
src/stores/
├── tab-store.js          # Tab management and WebView caching
├── app-data-store.js     # Application data and IPC communication
├── theme-store.js        # Dynamic theming system
└── [module]-store.js     # Business-specific stores
```

### Component Architecture
```
src/components/
├── content/
│   ├── MainContent.vue   # Hybrid content renderer
│   └── [...]
├── layout/
│   ├── Header.vue        # Application header
│   ├── Sidebar.vue       # Navigation sidebar
│   └── [...]
└── ui/                   # Reusable UI components
```

## 🔧 Development

### Prerequisites
- Node.js 16+ 
- npm 7+

### Installation
```bash
npm install
```

### Development Server
```bash
# Web development
npm run dev

# Electron development
npm run electron:dev
```

### Code Quality
```bash
# Linting
npm run lint

# Type checking (if TypeScript)
npm run type-check
```

### Building
```bash
# Web build
npm run build

# Electron build
npm run electron:build
```

## 🎯 WebView Caching System

### How it Works
1. **Container Persistence**: WebView container remains mounted to preserve all cached instances
2. **Visibility Control**: Uses `v-show` instead of `v-if` to maintain WebView state
3. **LRU Cache Management**: Automatically manages memory by removing oldest cached WebViews
4. **State Preservation**: Navigation history, scroll position, and media playback state maintained

### Benefits
- ✅ YouTube videos continue playing after tab switches
- ✅ Form data preserved in external sites
- ✅ Instant tab switching without reload
- ✅ Memory-efficient with configurable limits
- ✅ Session restoration capability

## 📊 Performance

### Optimizations
- **Lazy Loading**: Components loaded on demand
- **Virtual Scrolling**: For large lists and tables
- **Image Optimization**: Responsive images with lazy loading
- **Memory Management**: Controlled WebView cache with cleanup
- **Bundle Splitting**: Optimized webpack configuration

### Monitoring
- Real-time performance metrics collection
- Memory usage tracking for WebView instances
- User interaction analytics

## 🔐 Security

### Electron Security
- Context isolation enabled
- Node integration disabled in renderers
- Content Security Policy (CSP) implemented
- Secure IPC communication patterns

### Data Protection
- Local storage encryption
- Secure session management
- Input validation and sanitization

## 🧪 Testing

```bash
# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 📱 Platform Support

- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu 18.04+)
- ✅ Web browsers (Chrome, Firefox, Safari, Edge)

## 🤝 Contributing

1. Follow the established clean code patterns
2. Add JSDoc comments for new functions
3. Include unit tests for new features
4. Update documentation as needed

### Code Style
- ESLint configuration enforced
- Prettier for code formatting
- Vue.js style guide compliance
- Modern ES6+ syntax preferred

## 📄 License

[Add your license information]

---

**Built with modern web technologies for optimal performance and maintainability.**
