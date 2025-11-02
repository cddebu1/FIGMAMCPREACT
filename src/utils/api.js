// API utility functions for making authenticated requests

const API_BASE_URL = 'http://localhost:5000/api';

// Get access token from localStorage
const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

// Get refresh token from localStorage
const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

// Refresh the access token
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json();

  if (data.success) {
    localStorage.setItem('accessToken', data.accessToken);
    return data.accessToken;
  } else {
    // Refresh token is invalid, clear storage and redirect to login
    localStorage.clear();
    window.location.href = '/';
    throw new Error('Session expired. Please login again.');
  }
};

// Make authenticated API request
const authenticatedFetch = async (url, options = {}) => {
  let accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error('No access token available');
  }

  // Add Authorization header
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  // Make the request
  let response = await fetch(url, { ...options, headers });

  // If token expired, try to refresh and retry
  if (response.status === 401) {
    try {
      accessToken = await refreshAccessToken();

      // Retry the request with new token
      headers['Authorization'] = `Bearer ${accessToken}`;
      response = await fetch(url, { ...options, headers });
    } catch (error) {
      throw new Error('Authentication failed. Please login again.');
    }
  }

  return response;
};

// Get user profile (example protected route)
export const getUserProfile = async () => {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/auth/profile`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Logout user
export const logout = async () => {
  const userId = localStorage.getItem('userId');

  if (userId) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Clear all tokens
  localStorage.clear();
  window.location.href = '/';
};

export { authenticatedFetch, getAccessToken, getRefreshToken };
