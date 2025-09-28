import { redirect } from "next/navigation"
import { httpClient } from "./http-client"
import { cookieManager } from "./cookie-manager"
import type { LoginRequest, ApiResponse, AuthTokens, LoginResponse, User } from "../types/auth"

export class AuthService {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthTokens>> {
    console.log(" AuthService.login starting:", credentials.email)

    const response = await httpClient.request<LoginResponse>("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    console.log(" AuthService.login API response:", {
      hasData: !!response.data,
      hasError: !!response.error,
      status: response.status,
    })

    if (response.data?.data?.user?.access_token) {
  const user = response.data.data.user
  console.log(" AuthService.login success, setting cookies")

  await cookieManager.setAuthTokens(user.access_token, user)

  console.log(" AuthService.login completed successfully")
  return {
    data: {
      token: user.access_token,
      user,
    },
    status: response.status,
  }
}


    console.log(" AuthService.login failed:", {
      error: response.error,
      status: response.status,
      hasData: !!response.data,
      dataKeys: response.data ? Object.keys(response.data) : [],
    })

    return {
      error: response.error || "Login failed",
      status: response.status,
    }
  }

  async logout(): Promise<void> {
    console.log(" AuthService.logout starting")
    await cookieManager.clearAuthTokens()
    console.log(" AuthService.logout completed")
  }

  async getCurrentUser(): Promise<User | null> {
    console.log(" AuthService.getCurrentUser starting")
    const user = await cookieManager.getCurrentUser()
    console.log(" AuthService.getCurrentUser result:", user?.email || "no user")
    return user
  }

  async requireAuth(): Promise<User> {
    console.log(" AuthService.requireAuth starting")
    const user = await this.getCurrentUser()

    if (!user) {
      console.log(" AuthService.requireAuth no user found, redirecting to login")
      redirect("/login")
    }

    console.log(" AuthService.requireAuth success:", user.email)
    return user
  }
}

export const authService = new AuthService()
