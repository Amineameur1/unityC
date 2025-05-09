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
    const token = sessionStorage.getItem("token")
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

// Helper function to get auth headers with token
const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token") || sessionStorage.getItem("accessToken")
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// Update the departmentService to use Next.js API routes instead of direct API calls
export const departmentService = {
  async createDepartment(data) {
    try {
      // Use Next.js API route instead of direct API call
      const response = await fetch("/api/departments", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: data.name,
          budget: Number.parseInt(data.budget),
          companyId: data.companyId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create department")
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating department:", error)
      throw error
    }
  },

  async createSubDepartment(data) {
    try {
      // Use Next.js API route instead of direct API call
      const response = await fetch("/api/departments/sub", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: data.name,
          budget: Number.parseInt(data.budget),
          parentDepartmentId: data.parentDepartmentId,
          companyId: data.companyId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create sub-department")
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating sub-department:", error)
      throw error
    }
  },

  async updateDepartment(departmentId, data) {
    try {
      // Use Next.js API route instead of direct API call
      const response = await fetch(`/api/departments/${departmentId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: data.name,
          budget: data.budget ? Number.parseInt(data.budget) : undefined,
          parentDepartmentId: data.parentDepartmentId,
          companyId: data.companyId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update department")
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating department:", error)
      throw error
    }
  },

  async updateSubDepartment(subdepartmentId, data) {
    try {
      // Use Next.js API route for updating subdepartment
      const response = await fetch(`/api/departments/sub/${subdepartmentId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: data.name,
          budget: data.budget ? Number.parseInt(data.budget) : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update sub-department")
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating sub-department:", error)
      throw error
    }
  },

  async deleteDepartment(departmentId) {
    try {
      // Use Next.js API route instead of direct API call
      const response = await fetch(`/api/departments/${departmentId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete department")
      }

      return await response.json()
    } catch (error) {
      console.error("Error deleting department:", error)
      throw error
    }
  },

  async deleteSubDepartment(subdepartmentId) {
    try {
      // Use Next.js API route for deleting subdepartment
      const response = await fetch(`/api/departments/sub/${subdepartmentId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete sub-department")
      }

      return await response.json()
    } catch (error) {
      console.error("Error deleting sub-department:", error)
      throw error
    }
  },

  async getDepartments() {
    try {
      // Get the company ID from localStorage or another source
      const companyId = sessionStorage.getItem("companyId") || 12 // Default to 12 if not available

      // Use Next.js API route instead of direct API call
      const response = await fetch(`/api/departments?companyId=${companyId}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch departments")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching departments:", error)
      throw error
    }
  },

  async getDepartmentById(departmentId) {
    try {
      // Use Next.js API route instead of direct API call
      const response = await fetch(`/api/departments/${departmentId}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch department")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching department:", error)
      throw error
    }
  },

  async getSubDepartments(parentDepartmentId) {
    try {
      // Use Next.js API route instead of direct API call
      const response = await fetch(`/api/departments/sub/${parentDepartmentId}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch sub-departments")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching sub-departments:", error)
      throw error
    }
  },

  async updateDepartmentManager(departmentId, data) {
    try {
      // Use Next.js API route instead of direct API call
      const response = await fetch(`/api/departments/${departmentId}/manager`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          manager: data.manager,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update department manager")
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating department manager:", error)
      throw error
    }
  },
}

// Updated announcement service to use Next.js API routes with token-based authentication
export const announcementService = {
  async getAnnouncements() {
    try {
      const response = await fetch("/api/announcements", {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch announcements")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching announcements:", error)
      throw error
    }
  },

  async getGlobalAnnouncements() {
    try {
      const response = await fetch("/api/announcements/globals", {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch global announcements")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching global announcements:", error)
      throw error
    }
  },

  async createAnnouncement(data) {
    try {
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          priority: data.priority,
          departmentId: data.departmentId || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create announcement")
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating announcement:", error)
      throw error
    }
  },

  async updateAnnouncement(announcementId, departmentId, data) {
    try {
      const response = await fetch(`/api/announcements/${announcementId}?departmentId=${departmentId || ""}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          priority: data.priority,
          departmentId: data.departmentId || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update announcement")
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating announcement:", error)
      throw error
    }
  },

  async deleteAnnouncement(announcementId, departmentId) {
    try {
      const response = await fetch(`/api/announcements/${announcementId}?departmentId=${departmentId || ""}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete announcement")
      }

      return await response.json()
    } catch (error) {
      console.error("Error deleting announcement:", error)
      throw error
    }
  },

  async getEmployeeAnnouncements(employeeId, departmentId) {
    try {
      const response = await fetch(`/api/announcements/employee/${employeeId}?departmentId=${departmentId || ""}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch employee announcements")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching employee announcements:", error)
      throw error
    }
  },
}

export const employeeService = {
  async getActiveEmployees(companyId: number) {
    try {
      const response = await fetch(`/api/employees/company/${companyId}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch employees")
      }

      const data = await response.json()
      return data.employees
    } catch (error) {
      console.error("Error fetching employees:", error)
      throw error
    }
  },
}
