# JWT Authentication Implementation Guide

## Overview
This project now implements JWT (JSON Web Token) authentication for secure user login and session management.

## What Was Implemented

### Backend Changes

1. **New Dependencies**
   - `jsonwebtoken` - JWT generation and verification
   - `dotenv` - Environment variable management

2. **Environment Variables (`.env`)**
   ```
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_SECRET=your-refresh-secret-key
   JWT_REFRESH_EXPIRES_IN=7d
   ```

3. **New Files**
   - `utils/jwt.js` - JWT token generation and verification functions
   - `middleware/auth.js` - Authentication middleware for protected routes

4. **Database Updates**
   - Added `refreshToken` field to User model

5. **New API Endpoints**
   - `POST /api/auth/login` - Returns accessToken and refreshToken
   - `POST /api/auth/refresh` - Refreshes expired access tokens
   - `POST /api/auth/logout` - Clears refresh token
   - `GET /api/auth/profile` - Protected route example (requires JWT)

### Frontend Changes

1. **Token Storage**
   - Tokens stored in `localStorage` after successful login
   - Stored data: `accessToken`, `refreshToken`, `userId`, `userEmail`

2. **New Utility Functions (`src/utils/api.js`)**
   - `authenticatedFetch()` - Makes authenticated API requests
   - `getUserProfile()` - Example of calling protected route
   - `logout()` - Clears tokens and logs out user

## How It Works

### Login Flow
1. User submits email and password
2. Backend validates credentials
3. Backend generates JWT access token (expires in 1 hour) and refresh token (expires in 7 days)
4. Tokens sent to frontend and stored in localStorage
5. Frontend can now make authenticated requests

### Making Authenticated Requests
```javascript
import { authenticatedFetch } from './utils/api';

// Example: Fetch user profile
const response = await authenticatedFetch('http://localhost:5000/api/auth/profile');
const data = await response.json();
```

### Token Refresh Flow
1. When access token expires (401 error), frontend automatically:
   - Calls `/api/auth/refresh` with refresh token
   - Gets new access token
   - Retries original request
2. If refresh token is invalid/expired, user is redirected to login

### Logout Flow
1. User clicks logout
2. Frontend calls `/api/auth/logout` with userId
3. Backend clears refresh token from database
4. Frontend clears localStorage
5. User redirected to login page

## Testing the Implementation

### 1. Start the servers
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm start
```

### 2. Test Login
- Go to http://localhost:3000
- Login with existing credentials
- Check browser console - you should see accessToken and refreshToken
- Check localStorage (DevTools → Application → Local Storage)

### 3. Test Protected Route
Open browser console and run:
```javascript
// Get user profile (protected route)
fetch('http://localhost:5000/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

### 4. Test Token Expiry
```javascript
// Manually expire the access token (change it to invalid value)
localStorage.setItem('accessToken', 'invalid-token');

// Try to fetch profile - should automatically refresh token
import { getUserProfile } from './utils/api';
getUserProfile().then(data => console.log(data));
```

### 5. Test Logout
```javascript
import { logout } from './utils/api';
logout();
```

## Security Best Practices Implemented

1. ✅ Passwords hashed with bcrypt
2. ✅ JWT tokens signed with secret keys
3. ✅ Short-lived access tokens (1 hour)
4. ✅ Longer-lived refresh tokens (7 days)
5. ✅ Refresh tokens stored in database
6. ✅ Tokens invalidated on logout
7. ✅ Environment variables for secrets
8. ✅ Authorization header for token transmission

## Next Steps (Optional Enhancements)

1. **Create Dashboard Page**
   - Protected route that shows user info
   - Displays data from `/api/auth/profile`

2. **Add Logout Button**
   - Button in UI that calls `logout()` function

3. **HTTP-Only Cookies** (More Secure)
   - Store tokens in HTTP-only cookies instead of localStorage
   - Prevents XSS attacks

4. **Token Blacklisting**
   - Maintain list of invalidated tokens
   - Additional security layer

5. **Role-Based Access Control (RBAC)**
   - Add user roles (admin, user, etc.)
   - Protect routes based on roles

## API Endpoint Reference

### Public Endpoints (No JWT Required)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Protected Endpoints (JWT Required)
- `GET /api/auth/profile` - Get user profile
  - Header: `Authorization: Bearer <accessToken>`

### Token Management
- `POST /api/auth/refresh` - Refresh access token
  - Body: `{ "refreshToken": "..." }`
- `POST /api/auth/logout` - Logout user
  - Body: `{ "userId": "..." }`

## Troubleshooting

**Error: "No access token available"**
- User not logged in
- Solution: Login first

**Error: "Invalid or expired token"**
- Access token expired
- Solution: Auto-handled by `authenticatedFetch()`, or login again

**Error: "Session expired. Please login again"**
- Refresh token expired
- Solution: Login again

**Tokens not being saved**
- Check browser console for errors
- Verify localStorage is enabled in browser

## Environment Setup

**IMPORTANT:** Before deploying to production:
1. Change `JWT_SECRET` and `JWT_REFRESH_SECRET` to strong random values
2. Use a secure token generation tool:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Never commit `.env` file to version control
4. Use HTTPS in production
