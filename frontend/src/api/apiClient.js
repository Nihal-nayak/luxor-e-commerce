// src/api/apiClient.js

const BASE_URL = 'http://localhost:8080';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const apiClient = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  // Attach token
  const token = localStorage.getItem('accessToken');
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const config = {
    ...options,
    headers,
  };

  try {
    let response = await fetch(url, config);

    // If unauthorized, attempt to refresh token
    if (response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Attempt refresh
          const refreshRes = await fetch(`${BASE_URL}/Auth/Refresh`, {
            method: 'POST',
            credentials: 'include'
          });
          
          if (!refreshRes.ok) {
            throw new Error('Refresh failed');
          }
          
          const refreshData = await refreshRes.json();
          const newToken = refreshData.accessToken;
          
          localStorage.setItem('accessToken', newToken);
          isRefreshing = false;
          processQueue(null, newToken);
          
          // Retry the original request
          config.headers.set('Authorization', `Bearer ${newToken}`);
          response = await fetch(url, config);
          
        } catch (refreshErr) {
          isRefreshing = false;
          processQueue(refreshErr, null);
          // If refresh fails, clear auth state
          localStorage.removeItem('accessToken');
          // Dispatch a custom event so AuthContext can pick it up
          window.dispatchEvent(new Event('auth_logout'));
          throw refreshErr;
        }
      } else {
        // Wait for the refresh to finish and retry
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(newToken => {
          config.headers.set('Authorization', `Bearer ${newToken}`);
          return fetch(url, config);
        }).catch(err => {
          throw err;
        });
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
};
