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

export async function createUserAction(formData: FormData) {
  const userType = formData.get("userType") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const full_name = formData.get("full_name") as string
  const phone_number = formData.get("phone_number") as string
  const address = formData.get("address") as string

  if (!email || !password || !full_name || !phone_number || !address) {
    return { error: "All fields are required" }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address" }
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long" }
  }

  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  if (!phoneRegex.test(phone_number.replace(/\s/g, ""))) {
    return { error: "Please enter a valid phone number" }
  }

  try {
    let result
    const userData = {
      email,
      password,
      full_name,
      phone_number,
      address,
      gender: (formData.get("gender") as "MALE" | "FEMALE") || "MALE",
      date_of_birth: (formData.get("date_of_birth") as string) || new Date().toISOString().split("T")[0],
      profile_image: "",
    }

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

    if (result.error) {
      return { error: result.error }
    }

    revalidatePath(`/admin/${userType}s`)
    return { success: true, message: `${userType} created successfully` }
  } catch (error) {
    return { error: `Failed to create ${userType}. Please try again.` }
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
