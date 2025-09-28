import { cookies } from "next/headers"
import type { ApiResponse } from "../types/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://dev-sms.api.mecurixtech.com"

export class HttpClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    console.log(" HttpClient initialized with baseUrl:", this.baseUrl)
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    console.log(" HttpClient.request starting:", { endpoint, method: options.method || "GET" })

    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    const url = `${this.baseUrl}/api/v1${endpoint}`
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
      console.log(" HttpClient.request using auth token:", token.substring(0, 10) + "...")
    } else {
      console.log(" HttpClient.request no auth token found")
    }

    try {
      console.log(" HttpClient.request making fetch to:", url)
      const response = await fetch(url, {
        ...options,
        headers,
        cache: "no-store",
      })

      console.log(" HttpClient.request response status:", response.status)
      const data = await response.json()
      console.log(" HttpClient.request response data keys:", Object.keys(data || {}))

      if (!response.ok) {
        console.log(" HttpClient.request error response:", {
          status: response.status,
          error: data.detail || "An error occurred",
        })
        return {
          error: data.detail || "An error occurred",
          status: response.status,
        }
      }

      console.log(" HttpClient.request success")
      return {
        data,
        status: response.status,
      }
    } catch (error) {
      console.log(" HttpClient.request network error:", error)
      return {
        error: "Network error occurred",
        status: 500,
      }
    }
  }
}

export const httpClient = new HttpClient()
