import axios from "axios"

// Determine if we're running in development or production
const isDevelopment =
  process.env.NODE_ENV === "development" || (typeof window !== "undefined" && window.location.hostname === "localhost")

// Create an axios instance with default config
export const apiClient = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "http://localhost:5001/api/v1" : "/api/v1", // تحديث الرابط الأساسي
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important: This allows cookies to be sent with requests
})

// Add a request interceptor to include the auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token") || sessionStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we haven't already tried to refresh the token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const refreshToken = sessionStorage.getItem("refreshToken")
        const refreshResponse = await axios.post(
          `${isDevelopment ? "http://localhost:5001/api/v1" : "/api/v1"}/auth/refresh`,
          { refreshToken },
          { withCredentials: true },
        )

        if (refreshResponse.status === 200) {
          const newAccessToken = refreshResponse.data.accessToken
          sessionStorage.setItem("accessToken", newAccessToken)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return apiClient(originalRequest)
        } else {
          // If refresh fails, redirect to login
          if (typeof window !== "undefined") {
            window.location.href = "/login"
          }
          return Promise.reject(error)
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// Helper function to fetch data with authentication
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = sessionStorage.getItem("token") || sessionStorage.getItem("accessToken")

  // دمج الرؤوس المخصصة مع رؤوس التوثيق
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  // إنشاء خيارات الطلب النهائية
  const fetchOptions: RequestInit = {
    ...options,
    headers,
  }

  return fetch(url, fetchOptions)
}
