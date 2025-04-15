import api from "./api"

// Determine if we're running in development or production
const isDevelopment =
  process.env.NODE_ENV === "development" || (typeof window !== "undefined" && window.location.hostname === "localhost")

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterCompanyData {
  firstName: string
  lastName: string
  email: string
  password: string
  companyName: string
  companyIndustry: string
}

export interface RegisterEmployeeData {
  firstName: string
  lastName: string
  email: string
  password: string
  inviteCode: string
}

export interface User {
  employee: number
  company: number
  department: number
  role: string
  username: string
}

// Test account credentials
export const TEST_ACCOUNT = {
  username: "test_user",
  password: "test123",
  userData: {
    employee: 1,
    company: 6,
    department: 1,
    role: "Admin",
    username: "test_user",
  },
}

// Mock authentication for production environment
const mockAuth = {
  async login(credentials: LoginCredentials) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Check if using test account
    if (credentials.username === TEST_ACCOUNT.username && credentials.password === TEST_ACCOUNT.password) {
      return { user: TEST_ACCOUNT.userData, message: "Login successful (Test Account)" }
    }

    // Simple validation
    if (credentials.username && credentials.password) {
      const user = {
        employee: 1,
        company: 1,
        department: 1,
        role: "Admin",
        username: credentials.username,
      }

      return { user, message: "Login successful" }
    }

    throw new Error("Invalid credentials")
  },

  async registerCompany(data: RegisterCompanyData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple validation
    if (!data.email || !data.password || !data.firstName || !data.lastName || !data.companyName) {
      throw new Error("All fields are required")
    }

    const user = {
      employee: 1,
      company: 1,
      department: 1,
      role: "Company Manager",
      username: data.email.split("@")[0], // Create a username from email
    }

    return { user, message: "Company registration successful" }
  },

  async registerEmployee(data: RegisterEmployeeData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple validation
    if (!data.email || !data.password || !data.firstName || !data.lastName || !data.inviteCode) {
      throw new Error("All fields are required")
    }

    // Validate invite code (simple check for demo)
    if (data.inviteCode !== "DEMO123" && data.inviteCode !== "EMP-1234-ABCD") {
      throw new Error("Invalid invite code")
    }

    const user = {
      employee: 2,
      company: 1,
      department: 1,
      role: "Employee",
      username: data.email.split("@")[0], // Create a username from email
    }

    return { user, message: "Employee registration successful" }
  },

  async logout() {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { message: "Logout successful" }
  },

  isAuthenticated() {
    return false // In production mock, we'll always redirect to login
  },

  getCurrentUser(): User | null {
    return null
  },
}

// Real authentication service for development environment
const realAuth = {
  async login(credentials: LoginCredentials) {
    try {
      // Check if using test account
      if (credentials.username === TEST_ACCOUNT.username && credentials.password === TEST_ACCOUNT.password) {
        return { user: TEST_ACCOUNT.userData, message: "Login successful (Test Account)" }
      }

      const response = await api.post("/auth/login", credentials)

      // Store user info in localStorage for easy access
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user))
      }

      return response.data
    } catch (error) {
      throw error
    }
  },

  async registerCompany(data: RegisterCompanyData) {
    try {
      // For now, we'll use a mock implementation since the backend doesn't have this endpoint
      // In a real implementation, you would call the appropriate API endpoint
      const mockResponse = await mockAuth.registerCompany(data)

      // Store user info in localStorage
      if (mockResponse.user) {
        localStorage.setItem("user", JSON.stringify(mockResponse.user))
      }

      return mockResponse
    } catch (error) {
      throw error
    }
  },

  async registerEmployee(data: RegisterEmployeeData) {
    try {
      // For now, we'll use a mock implementation since the backend doesn't have this endpoint
      // In a real implementation, you would call the appropriate API endpoint
      const mockResponse = await mockAuth.registerEmployee(data)

      // Store user info in localStorage
      if (mockResponse.user) {
        localStorage.setItem("user", JSON.stringify(mockResponse.user))
      }

      return mockResponse
    } catch (error) {
      throw error
    }
  },

  async logout() {
    try {
      // Clear cookies by making a logout request
      // Note: You'll need to implement this endpoint on your backend
      // For now, we'll just clear localStorage
      localStorage.removeItem("user")

      return { message: "Logout successful" }
    } catch (error) {
      // Even if the request fails, clear local storage
      localStorage.removeItem("user")
      throw error
    }
  },

  isAuthenticated() {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem("user")
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    try {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        return JSON.parse(userStr)
      }
    } catch (error) {
      console.error("Error getting current user:", error)
    }

    return null
  },
}

// Choose the appropriate auth service based on environment
const authImplementation = isDevelopment ? realAuth : mockAuth

const AuthService = {
  ...authImplementation,
  TEST_ACCOUNT,
}

export default AuthService
