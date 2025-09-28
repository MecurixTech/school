export interface User {
  email: string
  full_name: string
  role: "admin" | "teacher" | "student" | "parent"
  phone_number?: string
  profile_image?: string
  id?: string
}

export interface UserWithToken extends User {
  access_token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  status: number | "success" | "failure"
  message?: string
}

export interface LoginResponse {
  status: string
  status_code: number
  message: string
  data: {
    user: UserWithToken
  }
}

export interface AuthTokens {
  token: string
  user: UserWithToken
}
