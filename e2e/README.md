# 🧪 E2E Test Suite

End-to-End tests using Playwright for comprehensive application testing.

## 📋 Test Files

### ✅ Existing Tests

1. **example.spec.js** - Basic navigation and application loading
2. **login.spec.js** - Complete login flow and authentication
3. **dashboard.spec.js** - Dashboard functionality and data display
4. **dark-mode.spec.js** - Dark mode toggle and persistence
5. **hasar-sorgula.spec.js** - Damage file search functionality

## 🚀 Running Tests

### Run All Tests
```bash
npm run test:e2e
```

### Run Tests with UI
```bash
npm run test:e2e:ui
```

### Run Tests in Headed Mode (see browser)
```bash
npm run test:e2e:headed
```

### Run Specific Test File
```bash
npx playwright test e2e/login.spec.js
```

### Run Tests in Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 🎯 Test Coverage

### Login Tests (login.spec.js)
- ✅ Display login page elements
- ✅ Show validation errors for empty form
- ✅ Login with valid credentials
- ✅ Toggle password visibility
- ✅ Refresh captcha

### Dashboard Tests (dashboard.spec.js)
- ✅ Display dashboard cards
- ✅ Display charts
- ✅ Navigate to menu
- ✅ Display process statistics
- ✅ Show user profile in taskbar

### Dark Mode Tests (dark-mode.spec.js)
- ✅ Toggle dark mode from taskbar
- ✅ Persist dark mode after page reload
- ✅ Show correct icon for current mode
- ✅ Have tooltip on dark mode button
- ✅ Change background gradient in dark mode

### Hasar Sorgula Tests (hasar-sorgula.spec.js)
- ✅ Display search form
- ✅ Have search button
- ✅ Display results table after search
- ✅ Have clear/reset button
- ✅ Navigate back to dashboard
- ✅ Display pagination if results exist
- ✅ Show loading indicator during search

## ⚙️ Configuration

Tests are configured in `playwright.config.js`:

- **Base URL**: `http://localhost:9000`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Screenshots**: On failure only
- **Videos**: Retained on failure
- **Traces**: On first retry
- **Parallel Execution**: Enabled
- **Auto Dev Server**: Starts automatically before tests

## 📊 Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

Reports include:
- Test results summary
- Screenshots on failure
- Video recordings (on failure)
- Execution traces
- Performance metrics

## 🔧 Debugging Tests

### Debug Mode
```bash
npx playwright test --debug
```

### Run with Trace Viewer
```bash
npx playwright test --trace on
npx playwright show-trace trace.zip
```

### Inspector
```bash
PWDEBUG=1 npx playwright test
```

## 📝 Writing New Tests

### Test Template
```javascript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/your-page')
  })

  test('should do something', async ({ page }) => {
    // Test implementation
    await expect(page.locator('selector')).toBeVisible()
  })
})
```

### Best Practices

1. **Use data-testid attributes** for stable selectors
2. **Wait for elements** before interacting
3. **Use meaningful test descriptions**
4. **Keep tests independent** - don't rely on order
5. **Clean up** after tests if needed
6. **Mock external dependencies** when possible

## 🎭 Playwright Features Used

- ✅ Auto-waiting for elements
- ✅ Network interception
- ✅ Screenshots & Videos
- ✅ Trace viewer
- ✅ Multiple browsers
- ✅ Mobile emulation
- ✅ Parallelization
- ✅ Retry mechanism

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Debugging Guide](https://playwright.dev/docs/debug)

## 🐛 Common Issues

### Port Already in Use
If port 9000 is busy, change it in `playwright.config.js`:
```javascript
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:9000'
}
```

### Browser Download Failed
```bash
npx playwright install
```

### Tests Timing Out
Increase timeout in `playwright.config.js`:
```javascript
use: {
  timeout: 60000 // 60 seconds
}
```

## ✨ Next Steps

Consider adding tests for:
- [ ] Menu navigation and search
- [ ] Account profile editing
- [ ] Password change flow
- [ ] Hasar dosya detay page
- [ ] Error handling scenarios
- [ ] Accessibility (a11y) tests
- [ ] Performance tests
- [ ] API response mocking

