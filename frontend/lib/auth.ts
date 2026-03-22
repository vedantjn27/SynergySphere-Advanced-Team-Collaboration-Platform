import { jwtDecode } from "jwt-decode"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface User {
  id: string
  username: string
  email: string
  is_active: boolean
  created_at: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

class AuthService {
  private getStoredTokens(): AuthTokens | null {
    if (typeof window === "undefined") return null

    const accessToken = localStorage.getItem("access_token")
    const refreshToken = localStorage.getItem("refresh_token")

    if (!accessToken || !refreshToken) return null

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: "bearer",
    }
  }

  private storeTokens(tokens: AuthTokens): void {
    localStorage.setItem("access_token", tokens.access_token)
    localStorage.setItem("refresh_token", tokens.refresh_token)
  }

  private clearTokens(): void {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
  }

  async register(data: RegisterData): Promise<AuthTokens> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Registration failed")
    }

    const tokens = await response.json()
    this.storeTokens(tokens)
    return tokens
  }

  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const formData = new FormData()
    formData.append("username", credentials.username)
    formData.append("password", credentials.password)

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Login failed")
    }

    const tokens = await response.json()
    this.storeTokens(tokens)
    return tokens
  }

  async logout(): Promise<void> {
    const tokens = this.getStoredTokens()
    if (tokens) {
      try {
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        })
      } catch (error) {
        console.error("Logout request failed:", error)
      }
    }
    this.clearTokens()
  }

  async getCurrentUser(): Promise<User | null> {
    const tokens = this.getStoredTokens()
    if (!tokens) return null

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token
          const refreshed = await this.refreshToken()
          if (refreshed) {
            return this.getCurrentUser()
          }
        }
        throw new Error("Failed to get user")
      }

      return await response.json()
    } catch (error) {
      console.error("Get current user failed:", error)
      this.clearTokens()
      return null
    }
  }

  async refreshToken(): Promise<boolean> {
    const tokens = this.getStoredTokens()
    if (!tokens) return false

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: tokens.refresh_token }),
      })

      if (!response.ok) {
        this.clearTokens()
        return false
      }

      const newTokens = await response.json()
      this.storeTokens(newTokens)
      return true
    } catch (error) {
      console.error("Token refresh failed:", error)
      this.clearTokens()
      return false
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000
      return decoded.exp ? decoded.exp < currentTime : true
    } catch {
      return true
    }
  }

  getAccessToken(): string | null {
    const tokens = this.getStoredTokens()
    return tokens?.access_token || null
  }

  isAuthenticated(): boolean {
    const tokens = this.getStoredTokens()
    if (!tokens) return false

    return !this.isTokenExpired(tokens.access_token)
  }
}

export const authService = new AuthService()
