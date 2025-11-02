# Project Setup Guide - FIGMA React Demo Login Application

## Project Overview
A full-stack user authentication application with login and registration functionality, built using React for the frontend and Express.js/MongoDB for the backend.

---

## Technology Stack

### Frontend
- **React 18.2.0** - JavaScript library for building user interfaces
- **React Router DOM 7.9.4** - Client-side routing for navigation between pages
- **React Scripts 5.0.1** - Configuration and scripts for Create React App

### Backend
- **Express 5.1.0** - Web application framework for Node.js
- **Mongoose 8.19.1** - MongoDB object modeling tool (ODM)
- **bcryptjs 3.0.2** - Password hashing library for secure password storage
- **CORS 2.8.5** - Middleware to enable Cross-Origin Resource Sharing

### Database
- **MongoDB** - NoSQL database (running locally at mongodb://localhost:27017)

---

## Project Structure

### Complete Folder Structure

```
FIGMA React Demo/
├── .claude/                      # Claude AI agent configurations
│   └── agents/                   # Playwright test generation agents
│       ├── playwright-test-generator.md
│       ├── playwright-test-healer.md
│       └── playwright-test-planner.md
├── .github/                      # GitHub-specific configurations
│   ├── chatmodes/                # Chat mode configurations for agents
│   │   ├── 🎭 planner.chatmode.md
│   │   ├── 🎭 generator.chatmode.md
│   │   └── 🎭 healer.chatmode.md
│   └── workflows/                # GitHub Actions workflows (if any)
├── .vscode/                      # VS Code workspace settings
│   └── mcp.json                  # MCP configuration for VS Code
├── middleware/                   # Express middleware functions
│   └── auth.js                   # JWT authentication middleware
├── models/                       # MongoDB/Mongoose data models
│   └── User.js
├── node_modules/                 # NPM dependencies (auto-generated)
├── public/                       # Static files served by React
│   ├── index.html
│   └── favicon.ico
├── routes/                       # Express API route handlers
│   └── auth.js
├── src/                          # React application source code
│   ├── utils/                    # Frontend utility functions
│   │   └── api.js                # Authenticated API request utilities
│   ├── App.js
│   ├── index.js
│   ├── LoginPage.jsx
│   ├── LoginPage.css
│   ├── RegistrationPage.jsx
│   └── RegistrationPage.css
├── test-results/                 # Playwright test execution results
│   └── .last-run.json            # Last test run metadata
├── tests/                        # Playwright test files
│   ├── seed.spec.ts              # Seed/setup test data
│   └── successful-registration.spec.ts
├── utils/                        # Backend utility functions
│   └── jwt.js                    # JWT token generation and verification
├── .env                          # Environment variables (not in version control)
├── .mcp.json                     # Model Context Protocol configuration
├── JWT_IMPLEMENTATION.md         # JWT authentication implementation guide
├── JWT_TEST_RESULTS.md           # JWT authentication test results
├── package.json                  # Project metadata and dependencies
├── package-lock.json             # Locked dependency versions
├── playwright.config.ts          # Playwright testing framework configuration
├── project_setup_guide.md        # This documentation file
├── server.js                     # Backend Express server entry point
└── test-plan.md                  # Manual test plan documentation
```

---

## File Descriptions

### Backend Files

#### `server.js`
**Purpose:** Main entry point for the Express backend server
- Loads environment variables using dotenv
- Initializes Express application
- Configures middleware (CORS, JSON parsing)
- Establishes MongoDB connection (supports environment variable configuration)
- Imports and mounts authentication routes
- Starts server on port 5000 (or from environment variable)

**Key Configuration:**
- MongoDB URI: `process.env.MONGODB_URI` or `mongodb://localhost:27017/loginapp` (default)
- Server Port: `process.env.PORT` or `5000` (default)
- Environment variables loaded from `.env` file

---

#### `models/User.js`
**Purpose:** Mongoose user schema with email/password/refreshToken fields, email validation, uniqueness constraint. Auto-hashes passwords with bcrypt (10 salt rounds) via pre-save hook. Includes `comparePassword()` method for authentication.

**Schema Fields:**
- `email` - String, required, unique, with format validation
- `password` - String, required, min 6 characters (hashed before saving)
- `refreshToken` - String, stores JWT refresh token for session management
- `createdAt` - Date, auto-generated timestamp

---

#### `routes/auth.js`
**Purpose:** Authentication API endpoints with JWT token management

**Public Endpoints:**
- **POST /api/auth/register** - Creates user accounts, validates email/password, checks duplicates
- **POST /api/auth/login** - Authenticates users, generates JWT access and refresh tokens, stores refresh token in database

**Token Management Endpoints:**
- **POST /api/auth/refresh** - Refreshes expired access tokens using valid refresh token
- **POST /api/auth/logout** - Clears refresh token from database, invalidates user session

**Protected Endpoints (JWT Required):**
- **GET /api/auth/profile** - Returns authenticated user profile (requires valid JWT in Authorization header)

**Error codes:** 400 (bad request), 401 (unauthorized), 500 (server errors)

---

#### `utils/jwt.js`
**Purpose:** JWT token generation and verification utilities

**Functions:**
- `generateAccessToken(userId)` - Creates short-lived access token (1 hour default)
- `generateRefreshToken(userId)` - Creates long-lived refresh token (7 days default)
- `verifyAccessToken(token)` - Validates and decodes access token
- `verifyRefreshToken(token)` - Validates and decodes refresh token

**Configuration:** Uses environment variables from `.env`:
- `JWT_SECRET` - Secret key for access tokens
- `JWT_EXPIRES_IN` - Access token expiration time
- `JWT_REFRESH_SECRET` - Secret key for refresh tokens
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration time

---

#### `middleware/auth.js`
**Purpose:** Express middleware for protecting routes with JWT authentication

**Functionality:**
- Extracts JWT token from Authorization header (Bearer token format)
- Verifies token signature and expiration using `verifyAccessToken()`
- Checks if user exists in database
- Attaches user data to `req.user` and `req.userId` for route handlers
- Returns 401 error for invalid/missing/expired tokens

**Usage Example:**
```javascript
router.get('/profile', authMiddleware, async (req, res) => {
  // Access authenticated user via req.user
  res.json({ user: req.user });
});
```

---

### Frontend Files

#### `src/App.js`
**Purpose:** Main React component with routing - `/ `→ LoginPage, `/register` → RegistrationPage

#### `src/index.js`
**Purpose:** React entry point - renders App component to DOM

---

#### `src/LoginPage.jsx`
**Purpose:** Login form component with email/password inputs, JWT authentication via `/api/auth/login`, React hooks for state management, navigation to registration page

**Key Features:**
- Authenticates users by calling POST `/api/auth/login`
- Stores JWT tokens (access and refresh) in localStorage upon successful login
- Stores userId and userEmail in localStorage for session tracking
- Provides feedback via alert messages
- Includes forgot password handler (placeholder)
- Redirects to registration page for new users

---

#### `src/LoginPage.css`
**Purpose:** Login page styles - centered card layout, blue/gray color scheme (#007aff primary, #e5e5e5 background), responsive inputs with hover states

---

#### `src/RegistrationPage.jsx`
**Purpose:** Registration form with email, password, confirm password fields. Client-side validation (password matching, min 6 chars), POST to `/api/auth/register`, redirects to login on success

---

#### `src/RegistrationPage.css`
**Purpose:** Registration page styles matching login design. Error messages styled with red (#ffebee background, #c62828 text)

---

#### `src/utils/api.js`
**Purpose:** Frontend utility functions for making authenticated API requests with automatic token refresh

**Exported Functions:**
- `getAccessToken()` - Retrieves access token from localStorage
- `getRefreshToken()` - Retrieves refresh token from localStorage
- `refreshAccessToken()` - Automatically refreshes expired access token using refresh token
- `authenticatedFetch(url, options)` - Makes authenticated API requests with Authorization header, auto-retries with refreshed token on 401 errors
- `getUserProfile()` - Example function to fetch user profile from protected `/api/auth/profile` endpoint
- `logout()` - Logs out user by calling `/api/auth/logout`, clears localStorage, redirects to login

**Key Features:**
- Automatic token refresh on expiration (401 errors)
- Session expiration handling (redirects to login if refresh token expired)
- Bearer token authentication in Authorization header
- Centralized API base URL configuration

**Usage Example:**
```javascript
import { authenticatedFetch, logout } from './utils/api';

// Make authenticated request
const response = await authenticatedFetch('http://localhost:5000/api/auth/profile');
const data = await response.json();

// Logout user
await logout();
```

---

### Configuration Files

#### `package.json`
**Purpose:** Project configuration and dependency management
- Project metadata (name, version, description)
- NPM scripts for running the application
- Dependency list with versions
- ESLint and browserslist configurations

**NPM Scripts:**
- `npm start` - Starts React development server (port 3000)
- `npm run server` - Starts Express backend server (port 5000)
- `npm run build` - Creates production build
- `npm test` - Runs tests

**DevDependencies:**
- `@playwright/test` - End-to-end testing framework
- `@types/node` - TypeScript type definitions for Node.js

---

#### `.mcp.json`
**Purpose:** Model Context Protocol (MCP) server configuration
- Defines MCP servers for Claude AI integration
- Configures Playwright test server for automated test generation
- Enables AI-powered testing workflows

**Configuration:**
```json
{
  "mcpServers": {
    "playwright-test": {
      "command": "npx",
      "args": ["playwright", "run-test-mcp-server"]
    }
  }
}
```

**Why needed:**
- Enables Claude Desktop to interact with Playwright
- Provides AI agents access to browser automation tools
- Facilitates automated test generation and healing

**When to modify:**
- Adding new MCP servers for different tools
- Configuring additional AI integrations
- Customizing agent capabilities

---

#### `playwright.config.ts`
**Purpose:** Playwright configuration - testDir: `./`, headless: false, viewport: 1280x720, actionTimeout: 60s, browser: Chromium

**When to modify:** Adding browsers, adjusting timeouts, changing viewport, toggling headless mode

---

#### `test-plan.md`
**Purpose:** Manual test plan documentation
- Comprehensive test scenarios for the application
- Defines test cases with steps and expected results
- Serves as reference for creating automated tests

**Test Sections:**
1. Login Page Navigation and UI
2. Login Functionality
3. Registration Page Navigation and UI
4. Registration Functionality (includes test case 4.1)
5. Navigation Flow
6. Form Validation and Security
7. Cross-browser Compatibility
8. Performance Testing

**Why needed:**
- Documents all testing requirements
- Guides automated test creation
- Ensures comprehensive test coverage
- Serves as QA reference documentation

**When to update:**
- Adding new features requiring testing
- Discovering edge cases or bugs
- Updating expected behaviors
- Adding cross-browser test scenarios

---

#### `.env`
**Purpose:** Environment variables for application configuration (not committed to version control)

**Required Variables:**
```
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d
MONGODB_URI=mongodb://localhost:27017/loginapp
PORT=5000
```

**Security Notes:**
- Never commit `.env` file to version control (add to `.gitignore`)
- Use strong random strings for JWT secrets in production
- Generate secrets using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Keep separate `.env` files for development and production

**When to modify:**
- Changing JWT token expiration times
- Updating database connection strings
- Configuring for different environments (dev/staging/prod)
- Rotating JWT secret keys

---

#### `JWT_IMPLEMENTATION.md`
**Purpose:** Comprehensive guide for JWT authentication implementation

**Contents:**
- Overview of JWT authentication system
- Backend changes (dependencies, environment variables, new files)
- Frontend changes (token storage, utility functions)
- Authentication flow explanations (login, token refresh, logout)
- Testing instructions with example code
- Security best practices implemented
- API endpoint reference
- Troubleshooting guide
- Next steps and optional enhancements

**When to reference:**
- Understanding JWT authentication flow
- Learning how to use authenticated API requests
- Troubleshooting authentication issues
- Planning additional protected routes
- Implementing enhanced security features

---

#### `JWT_TEST_RESULTS.md`
**Purpose:** Complete test results documentation for JWT authentication implementation

**Test Summary:**
- All 7 test cases passed successfully
- Covers registration, login, protected routes, token refresh, and logout
- Includes detailed request/response examples
- Security validation checklist

**Test Cases Documented:**
1. User Registration - Account creation validation
2. User Login with JWT - Token generation verification
3. Protected Route (Valid Token) - Authorized access test
4. Protected Route (Invalid Token) - Unauthorized access rejection
5. Token Refresh - Access token renewal process
6. Logout - Token invalidation verification
7. Token Invalidation After Logout - Post-logout security check

**When to reference:**
- Verifying JWT implementation is working correctly
- Understanding expected API responses
- Debugging authentication issues
- Creating additional tests for new features
- Validating security requirements

---

## Folder Descriptions

### `.claude/`
**Purpose:** Claude AI agent configurations for automated testing

**Subfolder: `.claude/agents/`** - Playwright agents (test-generator, test-healer, test-planner)

**When to modify:** Customizing agent behavior, adding capabilities, defining tools

---

### `.github/`
**Purpose:** GitHub configurations and workflows

**Subfolder: `.github/chatmodes/`** - Chat mode definitions for testing agents (planner, generator, healer)

**Subfolder: `.github/workflows/`** - Reserved for GitHub Actions (CI/CD pipelines)

**When to add:** CI/CD pipelines, automated testing workflows, deployment automation

---

### `.vscode/`
**Purpose:** VS Code workspace settings

**File: `.vscode/mcp.json`** - MCP server configuration for VS Code AI integrations

**When to modify:** Adding VS Code extensions, customizing editor behavior, configuring debugging

---

### `models/`
**Purpose:** MongoDB/Mongoose data models
- Defines database structure and validation rules
- Implements data layer business logic
- Contains schema definitions and model methods

**Current files:**
- `User.js` - User authentication model with JWT refresh token support

**When to add files here:**
- Creating new database collections
- Defining data schemas and relationships
- Adding model-level methods and validations
- Implementing database middleware (hooks)

---

### `middleware/`
**Purpose:** Express middleware functions for request processing
- Intercepts and processes HTTP requests before reaching route handlers
- Handles authentication, validation, logging, error handling
- Modular reusable request processing logic

**Current files:**
- `auth.js` - JWT authentication middleware for protecting routes

**When to add files here:**
- Creating custom authentication/authorization middleware
- Implementing request validation middleware
- Adding logging or monitoring middleware
- Creating error handling middleware
- Building rate limiting or security middleware

**Example middleware usage:**
```javascript
const authMiddleware = require('./middleware/auth');
router.get('/protected', authMiddleware, (req, res) => {
  // Route handler only runs after auth middleware validates JWT
});
```

---

### `utils/`
**Purpose:** Backend utility functions and helpers
- Reusable utility functions used across backend
- Business logic helpers
- Common operations and algorithms
- Configuration and setup helpers

**Current files:**
- `jwt.js` - JWT token generation and verification utilities

**When to add files here:**
- Creating utility functions for data formatting
- Implementing helper functions for common operations
- Adding configuration utilities
- Building shared business logic
- Creating validation helpers

---

### `routes/`
**Purpose:** Express API route handlers
- Organizes API endpoints by functionality
- Handles HTTP requests and responses
- Implements business logic for each endpoint

**Current files:**
- `auth.js` - Authentication endpoints (login, register)

**When to add files here:**
- Adding new API features
- Organizing endpoints by domain (e.g., products, orders, users)
- Separating concerns for better maintainability
- Creating modular API structure

---

### `src/`
**Purpose:** React application source code
- Contains all React components
- Includes component-specific styles
- Houses application entry point and routing configuration

**File Organization:**
- `.jsx` files - React components with UI logic
- `.css` files - Component-specific styles
- `.js` files - Configuration, utilities, and entry points

**Current files:**
- `App.js` - Main application component with routing
- `index.js` - React DOM entry point
- `LoginPage.jsx` & `LoginPage.css` - Login component
- `RegistrationPage.jsx` & `RegistrationPage.css` - Registration component

**Subfolders:**
- `utils/` - Frontend utility functions

**When to add files here:**
- Creating new React components
- Adding pages or views
- Implementing shared utilities or hooks
- Adding component-level styles

---

### `src/utils/`
**Purpose:** Frontend utility functions and API helpers
- Reusable functions for API communication
- Authentication and token management utilities
- Data formatting and transformation helpers
- Common frontend operations

**Current files:**
- `api.js` - Authenticated API request utilities with automatic token refresh

**When to add files here:**
- Creating API client functions
- Implementing data formatting utilities
- Adding form validation helpers
- Building custom React hooks
- Creating authentication utilities
- Implementing localStorage/sessionStorage wrappers

**Common utility patterns:**
- API clients for backend communication
- Token management functions
- Date/time formatting utilities
- Form validation helpers
- Error handling utilities
- Custom hooks for state management

---

### `tests/`
**Purpose:** Automated test files using Playwright
- Contains end-to-end (e2e) browser tests
- Tests user workflows and interactions
- Validates application behavior from user perspective

**Current files:**
- `seed.spec.ts` - Test data setup and seeding
- `successful-registration.spec.ts` - Registration flow tests

**File naming convention:** `*.spec.ts` or `*.test.ts`

**When to add files here:**
- Writing new test scenarios
- Testing new features or user flows
- Adding regression tests
- Implementing test case from test-plan.md

---

### `test-results/`
**Purpose:** Playwright test execution artifacts
- Auto-generated by Playwright test runner
- Contains test run metadata and results
- Stores screenshots and videos from test runs

**Current files:**
- `.last-run.json` - Metadata about most recent test execution

**Note:** This folder is typically excluded from version control (.gitignore).

---

### `node_modules/`
**Purpose:** NPM package dependencies
- Auto-generated by `npm install`
- Contains all project dependencies and sub-dependencies
- Should never be modified manually
- Excluded from version control (.gitignore)

**Size:** Can be large (100+ MB) depending on dependencies.

---

### `public/`
**Purpose:** Static assets served directly by React
- Contains HTML template for React app
- Static files accessible at root URL path
- Files served without processing

**Current files:**
- `index.html` - React application mount point
- `favicon.ico` - Browser tab icon

**When to add files here:**
- Adding images, fonts, or other static assets
- Including third-party libraries via CDN
- Adding robots.txt or manifest.json

---

## Database Structure

**Database:** `loginapp`
**Collection:** `users`
**Fields:**
- `_id` - MongoDB ObjectId (auto-generated)
- `email` - String, unique, lowercase, validated email format
- `password` - String, bcrypt hashed (10 salt rounds)
- `refreshToken` - String, stores JWT refresh token for session management
- `createdAt` - Date, auto-generated timestamp
- `__v` - Version key (Mongoose internal)

---

## Application Flow

### Registration Flow
User visits `/register` → fills form → frontend validates → POST to `/api/auth/register` → backend validates/checks duplicates → password hashed with bcrypt → saved to MongoDB → redirects to login

### Login Flow with JWT Authentication
1. User visits `/` and enters credentials
2. Frontend sends POST to `/api/auth/login` with email/password
3. Backend finds user and validates password using bcrypt
4. Backend generates JWT access token (expires in 1 hour) and refresh token (expires in 7 days)
5. Backend saves refresh token to user document in MongoDB
6. Backend returns tokens, userId, and email to frontend
7. Frontend stores tokens and user info in localStorage
8. User is now authenticated and can access protected routes

### Protected Route Access Flow
1. Frontend makes request to protected endpoint (e.g., `/api/auth/profile`)
2. Frontend includes access token in Authorization header: `Bearer <accessToken>`
3. Backend `authMiddleware` extracts and verifies token
4. If valid: middleware attaches user info to request, route handler processes request
5. If invalid/expired: returns 401 error, frontend automatically refreshes token

### Token Refresh Flow
1. Access token expires after 1 hour
2. Protected route returns 401 error
3. Frontend automatically calls `/api/auth/refresh` with refresh token
4. Backend verifies refresh token and checks against database
5. If valid: backend generates new access token
6. Frontend stores new access token and retries original request
7. If refresh token invalid/expired: redirects to login page

### Logout Flow
1. User initiates logout (e.g., clicks logout button)
2. Frontend calls `/api/auth/logout` with userId
3. Backend clears refresh token from user document in database
4. Frontend clears all tokens and user data from localStorage
5. Frontend redirects to login page
6. Previous tokens become invalid (refresh token deleted, access token expires)

### Security Features
- **Password Security:** bcrypt password hashing (10 salt rounds)
- **Input Validation:** Email format and required field validation, password length requirements (min 6 characters)
- **JWT Authentication:**
  - Signed tokens with secret keys (HS256 algorithm)
  - Short-lived access tokens (1 hour) for reduced exposure
  - Long-lived refresh tokens (7 days) for better UX
  - Refresh tokens stored in database for validation
  - Token invalidation on logout
- **API Security:**
  - Protected routes require valid JWT
  - Authorization header for secure token transmission
  - Generic error messages to prevent information leakage
- **Configuration:**
  - Environment variables for sensitive data
  - CORS configuration for cross-origin requests

---

## How to Run

**Prerequisites:** Node.js and MongoDB installed

**Start the Application:**
1. `mongod` - Start MongoDB
2. `npm run server` - Start backend (port 5000)
3. `npm start` - Start frontend (port 3000)

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/auth

**View Database:**
- MongoDB Compass: `mongodb://localhost:27017` → `loginapp` → `users`
- Mongo Shell: `mongosh` → `use loginapp` → `db.users.find().pretty()`

---

## Future Enhancements

### Implemented ✅
- JWT authentication with access and refresh tokens
- Session management with token refresh
- Environment variables for configuration
- Protected routes with JWT middleware

### Potential Additions
- **Security Enhancements:**
  - HTTP-only cookies for token storage (more secure than localStorage)
  - Token blacklisting for additional security layer
  - Rate limiting on authentication endpoints
  - Two-factor authentication (2FA)
  - HTTPS in production
  - Input sanitization middleware

- **User Features:**
  - Password reset functionality with email verification
  - Email verification for new registrations
  - User profile management page
  - User dashboard with protected content
  - Profile picture upload
  - Account settings page

- **Authorization:**
  - Role-based access control (RBAC) - admin, user roles
  - Permission-based access to different features
  - Organization/team management

- **Enhanced UX:**
  - Remember me functionality
  - Social authentication (Google, GitHub, etc.)
  - Account activity logs
  - Session management (view all active sessions)
  - Logout from all devices

---

## Testing Infrastructure

### Playwright Integration
Uses Playwright for end-to-end browser automation testing.

**Test Execution:**
- `npx playwright test` - Run all tests
- `npx playwright test --headed` - Show browser
- `npx playwright test --ui` - Interactive debugging

### AI-Powered Test Generation
Integrates with Claude AI via MCP for automated test generation.

**Available Agents:**
1. **playwright-test-generator** - Creates new tests
2. **playwright-test-healer** - Fixes broken tests
3. **playwright-test-planner** - Plans test strategies

Claude Desktop connects to Playwright MCP server, navigates the app, and generates test code automatically.

---

## Dependencies Explained

### Production Dependencies

**Backend:**
- `express` (5.1.0) - Server framework for building REST APIs
- `mongoose` (8.19.1) - MongoDB ODM for data modeling and validation
- `bcryptjs` (3.0.2) - Password hashing library for secure password storage
- `jsonwebtoken` (9.0.2) - JWT token generation and verification for authentication
- `dotenv` (17.2.3) - Environment variable management for configuration
- `cors` (2.8.5) - Cross-origin resource sharing middleware

**Frontend:**
- `react` (18.2.0) - UI library for building interactive components
- `react-dom` (18.2.0) - React DOM renderer
- `react-router-dom` (7.9.4) - Client-side routing for navigation
- `react-scripts` (5.0.1) - Build tooling and development server

### Development Dependencies
- `@playwright/test` (1.56.1) - End-to-end testing framework for browser automation
- `@types/node` (24.9.1) - TypeScript type definitions for Node.js APIs

### Why These Technologies?
- **React:** Component-based UI, great for SPAs, large ecosystem
- **Express:** Lightweight, flexible backend framework with middleware support
- **MongoDB:** Flexible schema, easy to scale, JSON-like documents
- **bcryptjs:** Industry standard for password hashing with salt rounds
- **jsonwebtoken:** Standard JWT implementation for stateless authentication
- **dotenv:** Simple environment variable management, keeps secrets secure
- **Mongoose:** Simplified MongoDB operations with schema validation and hooks
- **Playwright:** Cross-browser testing with reliable automation and debugging
- **Claude AI + MCP:** AI-assisted test generation and maintenance

### Key Version Notes
- Express 5.x brings improved error handling and async support
- React Router DOM 7.x provides enhanced data loading patterns
- Playwright 1.56.x includes improved trace viewing and debugging

---

## Troubleshooting

**MongoDB Connection Error:** Ensure `mongod` is running, check connection string in server.js or `.env` file

**Port Already in Use:** Kill process or change port in server.js/`.env` (backend 5000) or accept alternate port (frontend 3000)

**CORS Errors:** Verify CORS middleware in server.js, check API URL matches backend port

**Registration/Login Failing:** Ensure both servers running, verify MongoDB connection, check browser console and API endpoints

**JWT Environment Variables Missing:**
- Error: "Cannot read property 'sign' of undefined" or similar
- Solution: Create `.env` file in project root with required JWT variables (JWT_SECRET, JWT_REFRESH_SECRET, etc.)
- Verify `require('dotenv').config()` is at top of server.js

**Invalid or Expired Token Errors:**
- Check that JWT secrets in `.env` match between token generation and verification
- Verify token hasn't expired (check JWT_EXPIRES_IN setting)
- Ensure token is being sent in correct format: `Authorization: Bearer <token>`
- Check browser localStorage contains valid accessToken

**Token Refresh Failing:**
- Verify refresh token exists in localStorage
- Check that refresh token in database matches the one being sent
- Ensure JWT_REFRESH_SECRET is correctly set in `.env`
- If user was deleted from database, refresh token will fail

**Protected Routes Returning 401:**
- Verify user is logged in and has valid token in localStorage
- Check Authorization header is being sent correctly
- Ensure `authMiddleware` is applied to the route
- Verify token hasn't expired (try refreshing)

**Tokens Not Being Stored:**
- Check browser console for errors
- Verify localStorage is enabled in browser
- Check that login response includes accessToken and refreshToken
- Ensure no browser extensions are blocking localStorage

---

## Project Maintained By
FIGMA React Demo Team

Last Updated: November 2025

---

## Recent Changes (November 2025)

### JWT Authentication Implementation ✅
- Added JWT-based authentication with access and refresh tokens
- Implemented token refresh mechanism for seamless user experience
- Created authentication middleware for protecting routes
- Added frontend API utilities for authenticated requests
- Implemented secure logout with token invalidation
- Added comprehensive documentation (JWT_IMPLEMENTATION.md, JWT_TEST_RESULTS.md)

### New Dependencies
- `jsonwebtoken` (9.0.2) - JWT token generation and verification
- `dotenv` (17.2.3) - Environment variable management

### New Files & Folders
- `utils/jwt.js` - JWT utility functions
- `middleware/auth.js` - Authentication middleware
- `src/utils/api.js` - Frontend API helpers
- `.env` - Environment variables (not in version control)
- `JWT_IMPLEMENTATION.md` - Implementation guide
- `JWT_TEST_RESULTS.md` - Test results documentation

### Modified Files
- `models/User.js` - Added refreshToken field
- `routes/auth.js` - Added JWT endpoints (refresh, logout, profile)
- `server.js` - Added dotenv configuration
- `src/LoginPage.jsx` - Added token storage to localStorage
- `package.json` - Added new dependencies
