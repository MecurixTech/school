import { httpClient } from "./http-client"
import type { ApiResponse } from "../types/auth"

export class UserService {
  async getStudents(): Promise<ApiResponse<any[]>> {
    console.log(" UserService.getStudents")
    return httpClient.request("/admin/students")
  }

  async getTeachers(): Promise<ApiResponse<any[]>> {
    console.log(" UserService.getTeachers")
    return httpClient.request("/admin/teachers")
  }

  async getParents(): Promise<ApiResponse<any[]>> {
    console.log(" UserService.getParents")
    return httpClient.request("/admin/parents")
  }

  async getStats() {
    console.log(" UserService.getStats starting")

    const [studentsRes, teachersRes, parentsRes] = await Promise.all([
      this.getStudents(),
      this.getTeachers(),
      this.getParents(),
    ])

    const stats = {
      students: studentsRes.data?.length || 0,
      teachers: teachersRes.data?.length || 0,
      parents: parentsRes.data?.length || 0,
      admins: 1, // Assuming at least one admin exists
    }

    console.log(" UserService.getStats result:", stats)
    return stats
  }

  async createStudent(student: any): Promise<ApiResponse<any>> {
    console.log(" UserService.createStudent:", student.email)
    return httpClient.request("/admin/students", {
      method: "POST",
      body: JSON.stringify(student),
    })
  }

  async createTeacher(teacher: any): Promise<ApiResponse<any>> {
    console.log(" UserService.createTeacher:", teacher.email)
    return httpClient.request("/admin/teachers", {
      method: "POST",
      body: JSON.stringify(teacher),
    })
  }

  async createParent(parent: any): Promise<ApiResponse<any>> {
    console.log(" UserService.createParent:", parent.email)
    return httpClient.request("/admin/parents", {
      method: "POST",
      body: JSON.stringify(parent),
    })
  }

  async createAdmin(admin: any): Promise<ApiResponse<any>> {
    console.log(" UserService.createAdmin:", admin.email)
    return httpClient.request("/admin/admins", {
      method: "POST",
      body: JSON.stringify(admin),
    })
  }

  async deleteStudent(id: string): Promise<ApiResponse<any>> {
    console.log(" UserService.deleteStudent:", id)
    return httpClient.request(`/admin/students/${id}`, {
      method: "DELETE",
    })
  }

  async deleteTeacher(id: string): Promise<ApiResponse<any>> {
    console.log(" UserService.deleteTeacher:", id)
    return httpClient.request(`/admin/teachers/${id}`, {
      method: "DELETE",
    })
  }

  async deleteParent(id: string): Promise<ApiResponse<any>> {
    console.log(" UserService.deleteParent:", id)
    return httpClient.request(`/admin/parents/${id}`, {
      method: "DELETE",
    })
  }
}

export const userService = new UserService()
