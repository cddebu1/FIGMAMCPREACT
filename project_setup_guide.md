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
├── models/                       # MongoDB/Mongoose data models
│   └── User.js
├── node_modules/                 # NPM dependencies (auto-generated)
├── public/                       # Static files served by React
│   ├── index.html
│   └── favicon.ico
├── routes/                       # Express API route handlers
│   └── auth.js
├── src/                          # React application source code
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
├── .mcp.json                     # Model Context Protocol configuration
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
- Initializes Express application
- Configures middleware (CORS, JSON parsing)
- Establishes MongoDB connection to local instance
- Imports and mounts authentication routes
- Starts server on port 5000

**Key Configuration:**
- MongoDB URI: `mongodb://localhost:27017/loginapp`
- Server Port: `5000`

---

#### `models/User.js`
**Purpose:** Mongoose user schema with email/password fields, email validation, uniqueness constraint. Auto-hashes passwords with bcrypt (10 salt rounds) via pre-save hook. Includes `comparePassword()` method for authentication.

---

#### `routes/auth.js`
**Purpose:** Authentication API endpoints

**POST /api/auth/register** - Creates user accounts, validates email/password, checks duplicates

**POST /api/auth/login** - Authenticates users, validates credentials using bcrypt

**Error codes:** 400 (bad request), 401 (unauthorized), 500 (server errors)

---

### Frontend Files

#### `src/App.js`
**Purpose:** Main React component with routing - `/ `→ LoginPage, `/register` → RegistrationPage

#### `src/index.js`
**Purpose:** React entry point - renders App component to DOM

---

#### `src/LoginPage.jsx`
**Purpose:** Login form component with email/password inputs, authentication via `/api/auth/login`, React hooks for state management, navigation to registration page

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
- `User.js` - User authentication model

**When to add files here:**
- Creating new database collections
- Defining data schemas and relationships
- Adding model-level methods and validations
- Implementing database middleware (hooks)

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

**When to add files here:**
- Creating new React components
- Adding pages or views
- Implementing shared utilities or hooks
- Adding component-level styles

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
**Fields:** `_id`, `email`, `password` (bcrypt hashed), `createdAt`, `__v`

---

## Application Flow

### Registration Flow
User visits `/register` → fills form → frontend validates → POST to `/api/auth/register` → backend validates/checks duplicates → password hashed with bcrypt → saved to MongoDB → redirects to login

### Login Flow
User visits `/` → enters credentials → POST to `/api/auth/login` → backend finds user → compares password with bcrypt → returns user data on success

### Security Features
- bcrypt password hashing (10 salt rounds)
- Email format and required field validation
- Password length requirements (min 6 characters)
- CORS configuration for cross-origin requests
- Generic error messages to prevent information leakage

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
JWT authentication, session management, password reset, email verification, user profile management, protected routes, environment variables, input sanitization, rate limiting, HTTPS.

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
- `express` - Server framework
- `mongoose` - MongoDB ORM
- `bcryptjs` - Password encryption
- `cors` - Cross-origin requests
- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Client-side routing
- `react-scripts` - Build tooling

### Development Dependencies
- `@playwright/test` - End-to-end testing framework
- `@types/node` - TypeScript definitions for Node.js APIs

### Why These Technologies?
- **React:** Component-based UI, great for SPAs
- **Express:** Lightweight, flexible backend framework
- **MongoDB:** Flexible schema, easy to scale
- **bcrypt:** Industry standard for password hashing
- **Mongoose:** Simplified MongoDB operations with validation
- **Playwright:** Cross-browser testing with reliable automation
- **Claude AI + MCP:** AI-assisted test generation and maintenance

---

## Troubleshooting

**MongoDB Connection Error:** Ensure `mongod` is running, check connection string in server.js

**Port Already in Use:** Kill process or change port in server.js (backend 5000) or accept alternate port (frontend 3000)

**CORS Errors:** Verify CORS middleware in server.js, check API URL matches backend port

**Registration/Login Failing:** Ensure both servers running, verify MongoDB connection, check browser console and API endpoints

---

## Project Maintained By
FIGMA React Demo Team

Last Updated: October 2025
