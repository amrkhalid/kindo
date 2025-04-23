export const API = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1/',
  ENDPOINTS: {
    AUTH: {
      LOGIN: 'auth/login/web',
      LOGOUT: 'auth/logout',
    },
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'X-API-KEY': '1234567890'
  },
} as const; 