# Core Architecture (VS Code Inspired)

## Layers

### `base/`
- General utilities and building blocks
- Can be used by any other layer
- No dependencies on other layers

### `platform/`
- Service injection support
- Base services shared across application
- Should not include UI-specific code

### `workbench/`
- Main application framework
- UI components and layouts
- Desktop application logic

### `extensions/`
- Plugin system
- Extension APIs
- Third-party integrations

## Target Environments

### `common/`
- Basic JavaScript APIs
- Cross-platform code

### `browser/`
- Web APIs (DOM, etc.)
- Web-specific implementations

### `electron/`
- Electron APIs
- Desktop-specific features

### `node/`
- Node.js APIs
- File system operations 