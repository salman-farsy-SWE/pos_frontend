import axios from 'axios';

// Get the API URL from environment variables
const apiUrl = import.meta.env.VITE_API_URL;

// In development, use relative URL to leverage Vite proxy (avoids CORS)
// In production on Vercel, use relative URL to leverage Vercel serverless function proxy
// This avoids CORS issues since requests come from the same origin
const baseURL = import.meta.env.DEV 
    ? '/api/v1'  // Use Vite proxy in development
    : '/api/v1';  // Use Vercel serverless function proxy in production

// Validate that the API URL is set (only warn in production)
if (!import.meta.env.DEV && !apiUrl) {
    console.error('VITE_API_URL is not defined in environment variables!');
    console.error('Please check your .env file and ensure VITE_API_URL is set.');
    console.error('Current import.meta.env:', import.meta.env);
}

// Log the API URL (helps with debugging)
if (import.meta.env.DEV) {
    console.log('🔧 Development mode: Using Vite proxy');
    console.log('📡 API requests will be proxied to:', apiUrl || 'NOT SET');
    console.log('🌐 Base URL:', baseURL);
} else {
    console.log('🚀 Production mode: Using Vercel serverless proxy');
    console.log('📡 Backend API:', apiUrl || 'NOT SET');
    console.log('🌐 Base URL:', baseURL);
}

const api = axios.create({
    baseURL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle network errors (CORS, connection issues, etc.)
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            console.error('Network Error:', {
                message: error.message,
                code: error.code,
                config: {
                    url: error.config?.url,
                    baseURL: error.config?.baseURL,
                    method: error.config?.method,
                },
            });
            
            // Check if it's a CORS issue
            if (error.message === 'Network Error' && !error.response) {
                console.error(
                    '⚠️ CORS Error Detected!\n' +
                    'The backend server needs to allow requests from your frontend origin.\n' +
                    'Please ensure the backend has CORS configured to allow your frontend domain.'
                );
            }
        }
        
        // Handle other errors
        if (error.response) {
            // Server responded with error status
            console.error('API Error Response:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
            });
        } else if (error.request) {
            // Request was made but no response received
            console.error('No response received:', error.request);
        }
        
        return Promise.reject(error);
    }
);

export default api;
