import { cookies } from "next/headers"

export class CookieManager {
  async setCookie(
    name: string,
    value: string,
    options: {
      httpOnly?: boolean
      secure?: boolean
      sameSite?: "lax" | "strict" | "none"
      maxAge?: number
      path?: string
    } = {},
  ) {
    console.log(" CookieManager.setCookie:", { name, valueLength: value.length })

    const cookieStore = await cookies()
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      ...options,
    }

    cookieStore.set({
      name,
      value,
      ...cookieOptions,
    })

    console.log(" CookieManager.setCookie completed:", { name, options: cookieOptions })
  }

  async getCookie(name: string): Promise<string | undefined> {
    console.log(" CookieManager.getCookie:", name)

    const cookieStore = await cookies()
    const value = cookieStore.get(name)?.value

    console.log(" CookieManager.getCookie result:", { name, hasValue: !!value })
    return value
  }

  async deleteCookie(name: string) {
   
    const cookieStore = await cookies()
    cookieStore.set({
      name,
      value: "",
      maxAge: 0,
      path: "/",
    })

  }

  async setAuthTokens(token: string, user: import("../types/auth").UserWithToken) {
    console.log(" CookieManager.setAuthTokens:", {
      tokenLength: token.length,
      userEmail: user?.email,
    })

    await Promise.all([this.setCookie("auth_token", token), this.setCookie("user_data", JSON.stringify(user))])

  }

  async clearAuthTokens() {
 

    await Promise.all([this.deleteCookie("auth_token"), this.deleteCookie("user_data")])

  }

  async getCurrentUser() {
    console.log(" CookieManager.getCurrentUser starting")

    const userData = await this.getCookie("user_data")

    if (!userData) {
      console.log(" CookieManager.getCurrentUser no user data found")
      return null
    }

    try {
      const user = JSON.parse(userData)
      console.log(" CookieManager.getCurrentUser success:", user.email)
      return user
    } catch (error) {
      console.log(" CookieManager.getCurrentUser parse error:", error)
      return null
    }
  }
}

export const cookieManager = new CookieManager()
