import { createUserAction } from "@/lib/actions"
import { serverAuthClient } from "@/lib/auth-server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { FormOverlay } from "./client-form"

export default async function NewStudentPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string }
}) {
  await serverAuthClient.requireAuth()

  async function handleCreateStudent(formData: FormData) {
    "use server"

    formData.append("userType", "student")

    const result = await createUserAction(formData)

    if (result.error) {
      redirect("/admin/students/new?error=" + encodeURIComponent(result.error))
    }

    if (result.success) {
      redirect("/admin/students?success=" + encodeURIComponent(result.message || "Student created successfully"))
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/students">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Students
          </Link>
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Student</CardTitle>
          <CardDescription>Create a new student account in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleCreateStudent} className="space-y-4">
            <FormOverlay />
            {searchParams.error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {searchParams.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="full_name">
                Full Name <span className="text-destructive ml-1">*</span>
              </Label>
              <Input id="full_name" name="full_name" type="text" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-destructive ml-1">*</span>
              </Label>
              <Input id="email" name="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-destructive ml-1">*</span>
              </Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">
                Phone Number <span className="text-destructive ml-1">*</span>
              </Label>
              <Input id="phone_number" name="phone_number" type="tel" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Address <span className="text-destructive ml-1">*</span>
              </Label>
              <Input id="address" name="address" type="text" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">
                Date of Birth <span className="text-destructive ml-1">*</span>
              </Label>
              <Input id="date_of_birth" name="date_of_birth" type="date" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">
                Gender <span className="text-destructive ml-1">*</span>
              </Label>
              <Select name="gender" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_id">
                Parent ID <span className="text-destructive ml-1">*</span>
              </Label>
              <Input id="parent_id" name="parent_id" type="text" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile_image">Profile Image URL</Label>
              <Input id="profile_image" name="profile_image" type="text" />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Create Student
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/students">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
