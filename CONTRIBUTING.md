# Contributing to the Project

Welcome! We're excited that you want to contribute to our project. This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js 18.x or later
- npm 8.x or later
- Git

### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/project-name.git
   cd project-name
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── core/                 # Core architecture (VS Code inspired)
│   ├── base/            # Base utilities
│   ├── platform/        # Platform services
│   ├── workbench/       # Main application
│   └── extensions/      # Extension system
├── components/          # Vue components
├── stores/             # Pinia stores
├── pages/              # Application pages
├── layouts/            # Layout components
└── assets/             # Static assets
```

## Coding Guidelines

### TypeScript

- Use strict TypeScript
- Prefer interfaces over types
- Use meaningful variable names
- Add JSDoc comments for public APIs

### Vue Components

- Use Composition API
- Use `<script setup>` syntax
- Keep components focused and small
- Use proper prop definitions

### Testing

- Write unit tests for all new features
- Maintain test coverage above 80%
- Use descriptive test names
- Test edge cases

## Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes
3. Add tests for new functionality
4. Ensure all tests pass
5. Update documentation if needed
6. Submit a pull request

## Code Review

All submissions require review. We use GitHub pull requests for this purpose.

## Release Process

We use semantic versioning and automated releases through GitHub Actions.

## Questions?

Feel free to open an issue for any questions or concerns. 