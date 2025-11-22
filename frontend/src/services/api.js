import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (window.location.origin + '/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url !== '/auth/login' && error.config?.url !== '/auth/signup') {
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  getUser: (id) => api.get(`/users/${id}`),
  blockUser: (id) => api.post(`/users/${id}/block`),
  unblockUser: (id) => api.delete(`/users/${id}/block`),
};

export const postAPI = {
  create: (data) => api.post('/posts', data),
  getAll: () => api.get('/posts'),
  delete: (id) => api.delete(`/posts/${id}`),
};

export const likeAPI = {
  like: (id) => api.post(`/posts/${id}/like`),
  unlike: (id) => api.delete(`/posts/${id}/like`),
};

export const followAPI = {
  follow: (id) => api.post(`/users/${id}/follow`),
  unfollow: (id) => api.delete(`/users/${id}/follow`),
};

export const activityAPI = {
  getFeed: () => api.get('/activity'),
};

export const adminAPI = {
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  deletePost: (id) => api.delete(`/admin/posts/${id}`),
  deleteLike: (id) => api.delete(`/admin/likes/${id}`),
  createAdmin: (userId) => api.post('/admin/admins', { userId }),
  deleteAdmin: (id) => api.delete(`/admin/admins/${id}`),
};

export default api;

