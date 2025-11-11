# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based login/registration application with a Node.js/Express backend, MongoDB database, and JWT authentication. The UI was designed in Figma and implemented in React.

## Development Commands

### Backend
```bash
npm run server          # Start Express backend on port 5000
```

### Frontend
```bash
npm start              # Start React dev server on port 3000
npm run build          # Build production bundle
```

### Testing
```bash
npm test               # Run React tests
npx playwright test    # Run Playwright tests (requires both servers running)
npx playwright test --headed  # Run with visible browser
```

**Note:** The frontend expects the backend to be running on `http://localhost:5000` and the React app on `http://localhost:3000`.

## Architecture

### Authentication Flow

**JWT-based authentication** with access tokens (1 hour) and refresh tokens (7 days):

1. **Registration** → User submits email/password → Password hashed with bcrypt (10 rounds) → Saved to MongoDB
2. **Login** → Credentials validated → JWT tokens generated → Refresh token stored in DB → Both tokens sent to client
3. **Protected Routes** → Access token in Authorization header → Middleware validates token → User data attached to `req.user`
4. **Token Refresh** → When access token expires → Client sends refresh token → Server validates against DB → New access token issued
5. **Logout** → Refresh token cleared from database → Client clears localStorage

### Backend Architecture

**Entry Point:** `server.js`
- Loads environment variables from `.env`
- Connects to MongoDB (defaults to `mongodb://localhost:27017/loginapp`)
- Mounts auth routes at `/api/auth`

**Models:** `models/User.js`
- Mongoose schema with email (unique, validated), password (min 6 chars), refreshToken
- Pre-save hook automatically hashes passwords using bcrypt
- `comparePassword` method for authentication

**Routes:** `routes/auth.js`
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate and get tokens
- `POST /api/auth/refresh` - Get new access token using refresh token
- `POST /api/auth/logout` - Invalidate refresh token
- `GET /api/auth/profile` - Protected route example (requires auth middleware)

**JWT Utils:** `utils/jwt.js`
- `generateAccessToken(userId)` - Creates access token (JWT_SECRET, 1h)
- `generateRefreshToken(userId)` - Creates refresh token (JWT_REFRESH_SECRET, 7d)
- `verifyAccessToken(token)` - Validates access token
- `verifyRefreshToken(token)` - Validates refresh token

**Middleware:** `middleware/auth.js`
- Extracts and validates Bearer token from Authorization header
- Verifies token signature and expiration
- Looks up user in database
- Attaches user to `req.user` and `req.userId`
- Returns 401 for invalid/expired tokens

### Frontend Architecture

**Entry Point:** `src/index.js` → `src/App.js`

**Routing:**
- `/` → `LoginPage.jsx`
- `/register` → `RegistrationPage.jsx`

**API Client:** `src/utils/api.js`
- `authenticatedFetch()` - Makes requests with automatic token handling
- Adds Bearer token to Authorization header
- Detects 401 responses and triggers token refresh
- Automatically retries failed requests after refresh
- Redirects to login on refresh failure
- `logout()` - Calls backend logout endpoint and clears localStorage

**State Management:**
- Tokens stored in `localStorage` as `accessToken`, `refreshToken`, `userId`, `userEmail`
- No Redux/Context - simple localStorage-based approach

### Key Design Patterns

**Automatic Token Refresh:**
When a protected route returns 401, `src/utils/api.js` automatically:
1. Retrieves refresh token from localStorage
2. Calls `/api/auth/refresh`
3. Stores new access token
4. Retries the original request with new token
5. If refresh fails, redirects to login

**Password Security:**
- Passwords hashed using bcrypt with 10 salt rounds
- Hashing triggered automatically by Mongoose pre-save hook
- Only modified passwords are re-hashed (checks `isModified('password')`)

**Token Validation:**
- Access tokens verified on every protected route via middleware
- Refresh tokens validated against database to allow revocation
- User existence checked during token validation

## Environment Variables

Required in `.env`:
```
MONGODB_URI=mongodb://localhost:27017/loginapp
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
PORT=5000
```

**Critical:** JWT secrets must be strong random strings in production.

## Testing

The project uses Playwright for E2E tests:
- Test files: `tests/*.spec.ts`
- Config: `playwright.config.ts` (headless: false, viewport: 1280x720)
- `tests/seed.spec.ts` - Exploration seed test
- `tests/successful-registration.spec.ts` - Registration flow test

**Running tests:**
1. Start backend: `npm run server`
2. Start frontend: `npm start`
3. Run tests: `npx playwright test`

## File Dependencies

Key file interaction chains:

**Login Flow:**
```
LoginPage.jsx → POST /api/auth/login → routes/auth.js →
models/User.js (comparePassword) → utils/jwt.js (generate tokens) →
localStorage → authenticated state
```

**Protected Route:**
```
Component → utils/api.js → Authorization header → middleware/auth.js →
utils/jwt.js (verify) → models/User.js (lookup) → routes/auth.js handler
```

**Token Refresh:**
```
401 response → utils/api.js (refreshAccessToken) →
POST /api/auth/refresh → utils/jwt.js (verify refresh, generate access) →
localStorage (store new token) → retry original request
```

## Common Tasks

**Adding a new protected route:**
1. Add route in `routes/auth.js` with `authMiddleware`
2. Access user via `req.user` and `req.userId`
3. Call from frontend using `authenticatedFetch()` from `src/utils/api.js`

**Modifying User model:**
1. Update schema in `models/User.js`
2. Be careful with pre-save hook - only re-hash if password modified
3. Update registration/profile endpoints in `routes/auth.js`

**Changing token expiration:**
1. Update `.env` values for `JWT_EXPIRES_IN` and `JWT_REFRESH_EXPIRES_IN`
2. Use values like "15m", "1h", "7d" (parsed by jsonwebtoken)

**Adding new frontend routes:**
1. Add route in `src/App.js`
2. Create component in `src/` directory
3. Add corresponding CSS file if needed
4. Use `useNavigate()` from react-router-dom for navigation

## Reference Documentation

See `PROJECT_FLOWCHART.md` for detailed flowcharts showing:
- Complete application startup sequence
- Registration, login, and logout flows
- Protected route access and token refresh
- File interaction maps and execution order
