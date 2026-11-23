// import axios from "axios";

// export const apiClient = axios.create({
//   baseURL: "/api",
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Watch every response that comes back from the backend
// apiClient.interceptors.response.use(
//   (response) => {
//     // If the request succeeds (status 200), just return the data normally
//     return response;
//   },
//   (error) => {
//     // If the backend throws an error, this function catches it globally
//     if (error.response) {
//       const status = error.response.status;


//       if (status === 401 || status === 403) {
//         console.error("Session expired or unauthorized. Logging out...");


//         window.location.href = "/login";
//       }
//     }

//     // Always reject the promise so the specific component still knows an error happened
//     return Promise.reject(error);
//   }
// );














import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // Or your appropriate backend base path
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 ATTACH TOKEN AUTOMATICALLY TO EVERY REQUEST
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
