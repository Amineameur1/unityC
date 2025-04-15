import axios from "axios"

// Determine if we're running in development or production
const isDevelopment =
  process.env.NODE_ENV === "development" || (typeof window !== "undefined" && window.location.hostname === "localhost")

// تعديل الرابط الأساسي للـ API
// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "http://localhost:5001/api/v1" : "/api/v1", // تحديث الرابط الأساسي
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important: This allows cookies to be sent with requests
})

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
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
api.interceptors.response.use(
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
        await axios.post(
          `${isDevelopment ? "http://localhost:5001/api/v1" : "/api/v1"}/auth/accessToken`,
          {},
          { withCredentials: true },
        )

        // If successful, retry the original request
        return api(originalRequest)
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

export default api

// Updated departmentService with correct endpoints and response handling
export const departmentService = {
  async createDepartment(data) {
    try {
      const response = await api.post("/department", {
        name: data.name,
        budget: Number.parseInt(data.budget),
        companyId: data.companyId, // Include the company ID
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  async createSubDepartment(data) {
    try {
      const response = await api.post("/department/sub", {
        name: data.name,
        budget: Number.parseInt(data.budget),
        parentDepartmentId: data.parentDepartmentId,
        companyId: data.companyId, // Include the company ID
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  async updateDepartment(departmentId, data) {
    try {
      const response = await api.put(`/department/${departmentId}`, {
        name: data.name,
        budget: data.budget ? Number.parseInt(data.budget) : undefined,
        parentDepartmentId: data.parentDepartmentId,
        companyId: data.companyId, // Include the company ID if needed for validation
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  async deleteDepartment(departmentId) {
    try {
      const response = await api.delete(`/department/${departmentId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async getDepartments() {
    try {
      const response = await api.get("/department")
      return response.data // API returns array of departments directly
    } catch (error) {
      throw error
    }
  },

  async getDepartmentById(departmentId) {
    try {
      const response = await api.get(`/department/${departmentId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async getSubDepartments(parentDepartmentId) {
    try {
      const response = await api.get(`/subDepartment/${parentDepartmentId}`)
      return response.data // API returns array of sub-departments
    } catch (error) {
      throw error
    }
  },
}

// Updated announcement service with correct parameter order
export const announcementService = {
  async getAnnouncements() {
    try {
      const response = await api.get("/announcement")
      return response.data
    } catch (error) {
      throw error
    }
  },

  async createAnnouncement(data) {
    try {
      // Ensure correct parameter order based on the SQL query
      const response = await api.post("/announcement", {
        title: data.title,
        content: data.content,
        priority: data.priority,
        departmentId: data.departmentId || null,
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  async updateAnnouncement(announcementId, departmentId, data) {
    try {
      const response = await api.put(`/announcement/${announcementId}?departmentId=${departmentId || ""}`, {
        title: data.title,
        content: data.content,
        priority: data.priority,
        departmentId: data.departmentId || null,
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  async deleteAnnouncement(announcementId, departmentId) {
    try {
      const response = await api.delete(`/announcement/${announcementId}?departmentId=${departmentId || ""}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async getEmployeeAnnouncements(employeeId, departmentId) {
    try {
      const response = await api.get(`/announcement/employee/${employeeId}?departmentId=${departmentId || ""}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export const employeeService = {
  async getActiveEmployees(companyId: number) {
    try {
      const response = await api.get(`/employee/company/${companyId}`)
      return response.data.employees
    } catch (error) {
      throw error
    }
  },
}
