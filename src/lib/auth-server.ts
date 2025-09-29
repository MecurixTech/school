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
  status: number
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


export { httpClient } from "./services/http-client"
export { cookieManager } from "./services/cookie-manager"
export { authService } from "./services/auth-service"
export { userService } from "./services/user-service"

import { authService } from "./services/auth-service"
import { userService } from "./services/user-service"

class ServerAuthClient {

  login = authService.login.bind(authService)
  logout = authService.logout.bind(authService)
  getCurrentUser = authService.getCurrentUser.bind(authService)
  requireAuth = authService.requireAuth.bind(authService)

 
  getStudents = userService.getStudents.bind(userService)
  getTeachers = userService.getTeachers.bind(userService)
  getParents = userService.getParents.bind(userService)
  getParentById = userService.getParentById.bind(userService)
  getStats = userService.getStats.bind(userService)
  createStudent = userService.createStudent.bind(userService)
  createTeacher = userService.createTeacher.bind(userService)
  updateTeacher = userService.updateTeacher.bind(userService)
  deactivateTeacher = userService.deactivateTeacher.bind(userService)
  createParent = userService.createParent.bind(userService)
  createAdmin = userService.createAdmin.bind(userService)
  deleteStudent = userService.deleteStudent.bind(userService)
  deleteTeacher = userService.deleteTeacher.bind(userService)
  deleteParent = userService.deleteParent.bind(userService)
}

export const serverAuthClient = new ServerAuthClient()

console.log(" Auth system initialized with modular architecture")
