// import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: import.meta.env.API_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// export default apiClient;


import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // --- THIS IS THE CRITICAL FIX ---
  // This flag tells axios to send cookies with every request
  withCredentials: true,
});

// The old interceptor that set the "Authorization: Bearer" header is
// no longer needed and has been removed. The browser will now handle
// sending the httpOnly cookie automatically.

export default apiClient;