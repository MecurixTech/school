import { serverAuthClient } from "@/lib/auth-server"
import { DataTable } from "@/components/data-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { redirect } from "next/navigation"

interface Teacher {
  id: string
  email: string
  full_name: string
  phone_number: string
  address?: string
  profile_image?: string
}

const columns = [
  { key: "info", label: "Teacher Info" },
  { key: "email", label: "Email" },
  { key: "phone_number", label: "Phone" },
  { key: "address", label: "Address" },
]

export default async function TeachersPage() {
  await serverAuthClient.requireAuth()

  const response = await serverAuthClient.getTeachers()

  if (response.error) {
    redirect("/admin?error=" + encodeURIComponent("Failed to load teachers"))
  }

  const teachers: Teacher[] = Array.isArray(response.data) ? response.data : []

  const renderCell = (teacher: Teacher, column: any) => {
    switch (column.key) {
      case "info":
        const initials = teacher.full_name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={teacher.profile_image || "/placeholder.svg"}
                alt={teacher.full_name}
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-foreground">{teacher.full_name}</div>
              <div className="text-sm text-muted-foreground">
                ID: {teacher.id.slice(0, 8)}
              </div>
            </div>
          </div>
        )
      default:
        return String((teacher as any)[column.key] || "")
    }
  }

  return (
    <DataTable
      title="Teachers"
      data={teachers}
      columns={columns}
      searchPlaceholder="Search teachers..."
      createHref="/admin/teachers/new"
      viewHref={(id) => `/admin/teachers/${id}`}
      editHref={(id) => `/admin/teachers/${id}/edit`}
      renderCell={renderCell}
    />
  )
}
