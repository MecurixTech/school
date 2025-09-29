import { httpClient } from "./http-client"
import type { ApiResponse, TeacherResponse, ParentResponse , Parent, Teacher } from "../types/auth"

export class UserService {
 async getStudents(): Promise<ApiResponse<any[]>> {
    console.log("UserService.getStudents")
    const res = await httpClient.request("/admin/students")
    return res.data?.data ?? []
  }

  async getTeachers(): Promise<Teacher[]> {
  const res = await httpClient.request<TeacherResponse>("/admin/teachers")
  return res.data?.data ?? []
  }

   async getParents(): Promise<Parent[]> {
    const res = await httpClient.request<ParentResponse>("/admin/parents")
    return res.data?.data?.data ?? []
  }


  async getParentById(id: string): Promise<any | null> {
  try {
    const res = await httpClient.request(`/admin/parents/${id}`)
    return res.data?.data ?? null
  } catch (err) {
    console.error("Error fetching parent by id:", err)
    return null
  }
}


async getTeacherById(id: string): Promise<any | null> {
  try {
    const res = await httpClient.request(`/admin/teachers/${id}`)
    return res.data?.data ?? null
  } catch (err) {
    console.error("Error fetching parent by id:", err)
    return null
  }
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
      admins: 1,
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


async updateTeacher(id: string, data: any): Promise<ApiResponse<any>> {
  return httpClient.request(`/admin/teachers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

async deactivateTeacher(id: string): Promise<ApiResponse<any>> {
  return httpClient.request(`/admin/teachers/${id}/deactivate`, {
    method: "PATCH",
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
