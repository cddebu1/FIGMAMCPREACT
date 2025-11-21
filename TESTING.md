# Playwright Testing Guide

This guide provides detailed instructions for setting up and running Playwright end-to-end tests for the FIGMAMCPREACT application.

## Quick Setup

### Automated Setup

Run the setup script to automatically install dependencies and configure the environment:

```bash
npm run setup:tests
```

Or manually:

```bash
bash setup-tests.sh
```

This script will:
- Install npm dependencies
- Install Playwright browsers (Chromium)
- Create a `.env` file if it doesn't exist
- Check MongoDB installation and status

### Manual Setup

If you prefer to set up manually:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install chromium
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env  # Or create manually
   ```

4. **Ensure MongoDB is running:**
   ```bash
   mongod  # or: brew services start mongodb-community
   ```

## Running Tests

### Prerequisites

Before running tests, you **must** have both servers running:

1. **Backend server** (Terminal 1):
   ```bash
   npm run server
   ```
   Should show: `Server running on port 5000`

2. **Frontend server** (Terminal 2):
   ```bash
   npm start
   ```
   Should open browser at `http://localhost:3000`

### Execute Tests

Once both servers are running, run tests in a third terminal:

```bash
# Run all tests (headless)
npx playwright test

# Or use the npm script
npm run test:e2e
```

### Useful Test Commands

```bash
# Run with headed browser (visible)
npx playwright test --headed
npm run test:e2e:headed

# Run specific test file
npx playwright test tests/successful-registration.spec.ts

# Run tests matching a pattern
npx playwright test --grep "Registration"

# Run tests in debug mode
npx playwright test --debug

# Show test report
npx playwright show-report
```

## Available Tests

### 1. Seed Test (`tests/seed.spec.ts`)
- **Purpose:** Exploration and manual verification
- **What it does:** Opens the application and waits 30 seconds for manual inspection
- **Usage:** Good for debugging UI issues

### 2. Registration Flow Test (`tests/successful-registration.spec.ts`)
- **Purpose:** Validates the complete registration workflow
- **What it tests:**
  - Navigation to login page
  - Navigation to registration page
  - Form field filling
  - Registration submission
  - Success message verification
- **Output:** Creates screenshot in `test-results/` directory

## Common Issues and Solutions

### Error: `Cannot find module '@playwright/test'`

**Cause:** Dependencies not installed

**Solution:**
```bash
npm install
```

### Error: `Executable doesn't exist at ...`

**Cause:** Playwright browsers not installed

**Solution:**
```bash
npx playwright install chromium
# Or install all browsers:
npx playwright install
```

### Error: `net::ERR_CONNECTION_REFUSED at http://localhost:3000/`

**Cause:** Frontend server is not running

**Solution:**
```bash
# In a separate terminal:
npm start
```

### Error: `page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5000/`

**Cause:** Backend server is not running

**Solution:**
```bash
# In a separate terminal:
npm run server
```

### Error: `MongoServerError: connect ECONNREFUSED`

**Cause:** MongoDB is not running

**Solution:**
```bash
# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# Manual:
mongod --dbpath /path/to/data
```

### Tests fail with timeout errors

**Possible causes:**
1. Server not fully started - wait a few seconds after starting servers
2. Port already in use - check if another process is using port 3000 or 5000
3. Slow system - increase timeout in `playwright.config.ts`

**Solutions:**
```bash
# Check if ports are in use:
lsof -i :3000
lsof -i :5000

# Kill processes if needed:
kill -9 <PID>
```

## Test Configuration

The Playwright configuration is in `playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: './',
  use: {
    headless: !!process.env.CI,  // Headless in CI, headed locally
    viewport: { width: 1280, height: 720 },
    actionTimeout: 60000,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
```

### Key Settings

- **testDir:** `'./'` - Tests can be in root or `tests/` directory
- **headless:** Automatically headless in CI environments
- **viewport:** 1280x720 resolution
- **actionTimeout:** 60 seconds for each action
- **browser:** Chromium only (can add Firefox, WebKit)

## Writing New Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Navigate to page
    await page.goto('http://localhost:3000/');
    
    // Interact with elements
    await page.getByRole('button', { name: 'Click Me' }).click();
    
    // Verify results
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

### Best Practices

1. **Use semantic locators:** `getByRole()`, `getByText()`, `getByLabel()`
2. **Wait for elements:** Use `expect().toBeVisible()` instead of `waitForTimeout()`
3. **Generate unique test data:** Use timestamps or random strings for emails/usernames
4. **Handle dialogs:** Set up dialog handlers before triggering actions
5. **Clean up:** Use `afterEach` hooks to reset state

### Running Tests in CI/CD

The configuration automatically runs in headless mode when `CI` environment variable is set:

```bash
CI=true npx playwright test
```

## Debugging Tests

### Debug Mode

```bash
# Run with Playwright Inspector
npx playwright test --debug

# Run specific test in debug mode
npx playwright test tests/seed.spec.ts --debug
```

### Screenshots and Videos

Screenshots are automatically captured on failure. To always capture:

```typescript
// In test
await page.screenshot({ path: 'screenshot.png' });
```

Enable video recording in `playwright.config.ts`:

```typescript
use: {
  video: 'on',  // or 'retain-on-failure'
}
```

### Trace Viewer

Enable tracing for detailed debugging:

```bash
npx playwright test --trace on
```

View trace:

```bash
npx playwright show-trace trace.zip
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
