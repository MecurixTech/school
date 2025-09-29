export interface User {
  email: string
  full_name: string
  role: "admin" | "teacher" | "student" | "parent"
  phone_number?: string
  profile_image?: string
  id?: string

}

export interface Parent {
  id: string
  full_name: string
  email: string
  phone_number?: string
  spouse_name?: string
  gender?: "MALE" | "FEMALE" | "OTHER"
  profile_image?: string
  created_at?: string
  updated_at?: string
}

export interface Teacher {
  id: string
  email: string
  full_name: string
  phone_number: string
  address?: string
  profile_image?: string
}

export interface UserWithToken extends User {
  access_token: string
}

export interface  ParentResponse {
  status: string
  status_code: number
  message: string
  data: {
    total_count: number
    data: Parent[]
  }
}

export interface  TeacherResponse {
  status: string
  status_code: number
  message: string
  data: Teacher[]
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
