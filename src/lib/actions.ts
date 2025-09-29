"use server"

import { serverAuthClient } from "./auth-server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { cookieManager } from "@/lib/services/cookie-manager"


type FieldErrors = Record<string, string>

type ActionResult = {
  success?: boolean
  message?: string
  error?: string
  fieldErrors?: FieldErrors
}


export async function loginAction(formData: FormData): Promise<ActionResult> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const fieldErrors: FieldErrors = {}

  if (!email) {
    fieldErrors.email = "Email is required"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Please enter a valid email address"
  }

  if (!password) {
    fieldErrors.password = "Password is required"
  } else if (password.length < 6) {
    fieldErrors.password = "Password must be at least 6 characters long"
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors }
  }

  try {
    const result = await serverAuthClient.login({ email, password })

    if (result?.status === "failure") {
      if (result.message?.toLowerCase().includes("email")) {
        return { fieldErrors: { email: result.message } }
      }
      if (result.message?.toLowerCase().includes("password")) {
        return { fieldErrors: { password: result.message } }
      }
      return { error: result.message }
    }

    if (result?.error) {
      return { error: result.error }
    }

    return { success: true, message: "Login successful" }
  } catch {
    return { error: "Login failed. Please try again." }
  }
}


export async function logoutAction() {
  try {
    console.log("[logoutAction] START")
    await cookieManager.clearAuthTokens()
    console.log("[logoutAction] SUCCESS")
    redirect("/login")
  } catch (error) {
    console.error("[logoutAction] Failed:", error)
    redirect("/login?error=" + encodeURIComponent("Logout failed"))
  }
}

export async function createUserAction(formData: FormData): Promise<ActionResult> {
  const userType = formData.get("userType") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const full_name = formData.get("full_name") as string
  const phone_number = formData.get("phone_number") as string
  const address = formData.get("address") as string
  const date_of_birth = (formData.get("date_of_birth") as string) || new Date().toISOString().split("T")[0]
  const gender = (formData.get("gender") as "MALE" | "FEMALE") || "MALE"
  const profile_image = (formData.get("profile_image") as string) || ""

  // Basic validation
  const fieldErrors: Record<string, string> = {}
  if (!email) fieldErrors.email = "Email is required"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Invalid email address"

  if (!password) fieldErrors.password = "Password is required"
  else if (password.length < 8) fieldErrors.password = "Password must be at least 8 characters long"

  if (!full_name) fieldErrors.full_name = "Full name is required"
  if (!phone_number) fieldErrors.phone_number = "Phone number is required"
  else if (!/^[+]?[1-9][\d]{0,15}$/.test(phone_number.replace(/\s/g, "")))
    fieldErrors.phone_number = "Invalid phone number"

  if (!address) fieldErrors.address = "Address is required"

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors }
  }

  const userData = {
    email,
    password,
    full_name,
    phone_number,
    address,
    gender,
    date_of_birth,
    profile_image,
  }

  try {
    let result: any

    switch (userType) {
      case "student":
        result = await serverAuthClient.createStudent({
          ...userData,
          parent_id: (formData.get("parent_id") as string) || "",
        })
        break
      case "teacher":
        result = await serverAuthClient.createTeacher(userData)
        break
      case "parent":
        result = await serverAuthClient.createParent({
          ...userData,
          spouse_name: (formData.get("spouse_name") as string) || "",
          spouse_email: (formData.get("spouse_email") as string) || "",
          spouse_phone_number: (formData.get("spouse_phone_number") as string) || "",
        })
        break
      default:
        return { error: "Invalid user type" }
    }

    // Handle backend response properly
    if (result?.status === "failure") {
      // return backend-provided message if exists
      const message = result.message || `Failed to create ${userType}`
      return { error: message }
    }

    if (result?.status === "success") {
      revalidatePath(`/admin/${userType}s`)
      return { success: true, message: result.message || `${userType} created successfully` }
    }

    // Fallback for unexpected response
    return { error: `Failed to create ${userType}. Please try again.` }
  } catch (err: any) {
    // If the error has a response from the server, use its message
    if (err?.response?.data?.message) {
      return { error: err.response.data.message }
    }
    console.error(`[createUserAction] Error creating ${userType}:`, err)
    return { error: `Failed to create ${userType}. Please try again.` }
  }
}


export async function updateTeacherAction(id: string, data: any) {
  try {
    const res = await serverAuthClient.updateTeacher(id, data)
    if (res.error) {
      return { error: res.error }
    }
    revalidatePath(`/admin/teachers/${id}`)
    return { success: true, message: "Teacher updated successfully" }
  } catch (err) {
    return { error: "Failed to update teacher" }
  }
}

export async function deactivateTeacherAction(id: string) {
  try {
    const res = await serverAuthClient.deactivateTeacher(id)
    if (res.error) {
      return { error: res.error }
    }
    revalidatePath(`/admin/teachers`)
    return { success: true, message: "Teacher deactivated successfully" }
  } catch (err) {
    return { error: "Failed to deactivate teacher" }
  }
}

export async function createAdminAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const full_name = formData.get("full_name") as string
  const phone_number = formData.get("phone_number") as string
  const address = formData.get("address") as string
  const date_of_birth = formData.get("date_of_birth") as string
  const gender = formData.get("gender") as "MALE" | "FEMALE"
  const profile_image = formData.get("profile_image") as string

  if (!email || !password || !full_name || !phone_number || !address || !date_of_birth || !gender) {
    redirect("/admin/register?error=" + encodeURIComponent("All required fields must be filled"))
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    redirect("/admin/register?error=" + encodeURIComponent("Please enter a valid email address"))
  }

  if (password.length < 8) {
    redirect("/admin/register?error=" + encodeURIComponent("Password must be at least 8 characters long"))
  }

  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  if (!phoneRegex.test(phone_number.replace(/\s/g, ""))) {
    redirect("/admin/register?error=" + encodeURIComponent("Please enter a valid phone number"))
  }

  try {
    const adminData = {
      email,
      password,
      full_name,
      phone_number,
      address,
      date_of_birth,
      gender,
      profile_image: profile_image || "",
      role: "admin" as const,
    }

    const result = await serverAuthClient.createAdmin(adminData)

    if (result.error) {
      redirect("/admin/register?error=" + encodeURIComponent(result.error))
    }

    revalidatePath("/admin")
    redirect("/admin/register?success=" + encodeURIComponent("Admin account created successfully"))
  } catch (error) {
    redirect("/admin/register?error=" + encodeURIComponent("Failed to create admin account. Please try again."))
  }
}
