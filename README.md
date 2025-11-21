# FIGMAMCPREACT

A React-based login/registration application with Node.js/Express backend, MongoDB database, and JWT authentication. The UI was designed in Figma and implemented in React.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn package manager

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Playwright Browsers (Required for E2E Tests)

```bash
npx playwright install
```

Or install only Chromium (used by tests):

```bash
npx playwright install chromium
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/loginapp
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
PORT=5000
```

**Note:** Replace the JWT secrets with strong random strings in production.

### 4. Start MongoDB

Ensure MongoDB is running on your system:

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Or run MongoDB manually
mongod --dbpath /path/to/data/directory
```

## Running the Application

### Start the Backend Server

```bash
npm run server
```

The backend will run on `http://localhost:5000`

### Start the Frontend Development Server

In a new terminal:

```bash
npm start
```

The React app will run on `http://localhost:3000`

## Testing

### Running Playwright E2E Tests

**Important:** Both backend and frontend servers must be running before executing tests.

1. Start the backend server: `npm run server` (in terminal 1)
2. Start the frontend: `npm start` (in terminal 2)
3. Run tests: `npx playwright test` (in terminal 3)

Run tests with visible browser (headed mode):

```bash
npx playwright test --headed
```

Run specific test:

```bash
npx playwright test tests/successful-registration.spec.ts
```

### Running React Unit Tests

```bash
npm test
```

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Project Structure

- `/src` - React frontend application
- `/routes` - Express backend routes
- `/models` - Mongoose database models
- `/middleware` - Express middleware (auth, etc.)
- `/utils` - Utility functions (JWT helpers)
- `/tests` - Playwright E2E tests
- `server.js` - Express server entry point

## Troubleshooting

### Playwright Test Errors

**Error: `Cannot find module '@playwright/test'`**
- Solution: Run `npm install` to install dependencies

**Error: `Executable doesn't exist at ...`**
- Solution: Run `npx playwright install` to install browsers

**Error: `net::ERR_CONNECTION_REFUSED at http://localhost:3000/`**
- Solution: Make sure both backend (`npm run server`) and frontend (`npm start`) are running

### MongoDB Connection Errors

- Ensure MongoDB is running: `mongod --version`
- Check connection string in `.env` file
- Verify MongoDB is accessible on the configured port (default: 27017)

## License

This project is for educational purposes.
