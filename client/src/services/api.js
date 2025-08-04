import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('Request error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor to handle common responses
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }

    return response.data;
  },
  (error) => {
    // Log error in development
    if (import.meta.env.DEV) {
      console.error('Response error:', error);
    }

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          if (window.location.pathname !== '/login') {
            toast.error('Session expired. Please login again.');
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden
          toast.error('You do not have permission to perform this action');
          break;

        case 404:
          // Not found
          if (!window.location.pathname.includes('/404')) {
            toast.error('The requested resource was not found');
          }
          break;

        case 422:
          // Validation error
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach((err) => {
              toast.error(err.msg || err.message);
            });
          } else {
            toast.error(data.message || 'Validation failed');
          }
          break;

        case 429:
          // Rate limit
          toast.error('Too many requests. Please try again later.');
          break;

        case 500:
          // Server error
          toast.error('Server error. Please try again later.');
          break;

        default:
          // Other errors
          toast.error(data.message || 'An unexpected error occurred');
      }

      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
      return Promise.reject({ message: 'Network error' });
    } else {
      // Other error
      toast.error('An unexpected error occurred');
      return Promise.reject({ message: error.message });
    }
  }
);

// API endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    updateProfile: '/auth/profile',
    changePassword: '/auth/password',
    deleteAccount: '/auth/account',
  },

  // Posts endpoints
  posts: {
    getAll: '/posts',
    getById: (id) => `/posts/${id}`,
    getBySlug: (slug) => `/posts/slug/${slug}`,
    create: '/posts',
    update: (id) => `/posts/${id}`,
    delete: (id) => `/posts/${id}`,
    like: (id) => `/posts/${id}/like`,
    search: '/posts/search',
    featured: '/posts/featured',
  },

  // Categories endpoints
  categories: {
    getAll: '/categories',
    getById: (id) => `/categories/${id}`,
    getBySlug: (slug) => `/categories/slug/${slug}`,
    create: '/categories',
    update: (id) => `/categories/${id}`,
    delete: (id) => `/categories/${id}`,
  },

  // Comments endpoints
  comments: {
    getByPost: (postId) => `/posts/${postId}/comments`,
    create: (postId) => `/posts/${postId}/comments`,
    update: (id) => `/comments/${id}`,
    delete: (id) => `/comments/${id}`,
    like: (id) => `/comments/${id}/like`,
    getReplies: (id) => `/comments/${id}/replies`,
  },

  // Upload endpoints
  upload: {
    image: '/upload/image',
    file: '/upload/file',
  },
};

// Helper functions for common API operations
export const apiHelpers = {
  // GET request with query parameters
  get: (url, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return api.get(fullUrl);
  },

  // POST request
  post: (url, data = {}) => api.post(url, data),

  // PUT request
  put: (url, data = {}) => api.put(url, data),

  // PATCH request
  patch: (url, data = {}) => api.patch(url, data),

  // DELETE request
  delete: (url) => api.delete(url),

  // Upload file
  upload: (url, formData, onUploadProgress = null) => {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },
};

// Export configured axios instance
export default api;    return Promise.reject(error);
  }
);

// Post API services
export const postService = {
  // Get all posts with optional pagination and filters
  getAllPosts: async (page = 1, limit = 10, category = null) => {
    let url = `/posts?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  // Get a single post by ID or slug
  getPost: async (idOrSlug) => {
    const response = await api.get(`/posts/${idOrSlug}`);
    return response.data;
  },

  // Create a new post
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // Update an existing post
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  // Delete a post
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Add a comment to a post
  addComment: async (postId, commentData) => {
    const response = await api.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  },

  // Search posts
  searchPosts: async (query) => {
    const response = await api.get(`/posts/search?q=${query}`);
    return response.data;
  },
};

// Category API services
export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Create a new category
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
};

// Auth API services
export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default api; 
