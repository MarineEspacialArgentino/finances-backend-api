import axios from 'axios';

// Crear una instancia de axios con la URL base de la API
const api = axios.create({
  baseURL: '/api',
});

// Vincula el token JWT a cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejar token refresh en casos de 401 Errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        const { data } = await axios.post('/api/token/refresh/', { refresh: refreshToken });
        localStorage.setItem('accessToken', data.access);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${data.access}`,
        };
        return api(originalRequest);
      } catch (refreshError) {
        // en caso de fallo en refresh, Quita tokens y fuerza logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
