export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  try {
    // Get access token from localStorage
    const accessToken = localStorage.getItem("accessToken")

    // Set up headers
    const headers = {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    }

    // Make the request with credentials to include cookies
    let response = await fetch(url, {
      ...options,
      credentials: "include", // This is still important for cookies
      headers,
    })

    // Log the response status for debugging
    console.log(`fetchWithAuth response status for ${url}: ${response.status}`)

    // If we get a 401 Unauthorized, try to refresh the token
    if (response.status === 401) {
      console.log("Access token expired, attempting to refresh...")

      // Try to refresh the token
      const refreshed = await refreshAccessToken()

      if (refreshed) {
        // Get the new access token
        const newAccessToken = localStorage.getItem("accessToken")

        // Update the Authorization header with the new token
        const newHeaders = {
          "Content-Type": "application/json",
          ...(newAccessToken ? { Authorization: `Bearer ${newAccessToken}` } : {}),
          ...options.headers,
        }

        // Retry the request with the new token
        response = await fetch(url, {
          ...options,
          credentials: "include",
          headers: newHeaders,
        })

        console.log(`Retry response status for ${url}: ${response.status}`)

        // If still unauthorized after refresh, redirect to login
        if (response.status === 401) {
          console.error("Authentication failed even after token refresh. Redirecting to login...")
          window.location.href = "/login"
        }
      } else {
        // If refresh failed, redirect to login
        console.error("Token refresh failed. Redirecting to login...")
        window.location.href = "/login"
      }
    }

    return response
  } catch (error) {
    console.error(`fetchWithAuth error for ${url}:`, error)
    throw error
  }
}

/**
 * Refreshes the access token using the refresh token
 * @returns Promise<boolean> True if refresh was successful
 */
async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshToken = localStorage.getItem("refreshToken")

    if (!refreshToken) {
      return false
    }

    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      throw new Error("Failed to refresh token")
    }

    const data = await response.json()

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken)

      // Update refresh token if a new one is provided
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken)
      }

      return true
    }

    return false
  } catch (error) {
    console.error("Error refreshing token:", error)
    return false
  }
}
