import { serverAuthClient } from "@/lib/auth-server"
import { DataTable } from "@/components/data-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { redirect } from "next/navigation"

interface Student {
  id: string
  email: string
  full_name: string
  phone_number: string
  address?: string
  gender: "MALE" | "FEMALE"
  profile_image?: string
}

const columns: { key: keyof Student | "info"; label: string }[] = [
  { key: "info", label: "Student Info" },
  { key: "email", label: "Email" },
  { key: "phone_number", label: "Phone" },
  { key: "address", label: "Address" },
  { key: "gender", label: "Gender" },
]

export default async function StudentsPage() {
  await serverAuthClient.requireAuth()

  const studentsResponse = await serverAuthClient.getStudents()
  if (studentsResponse.error) {
    redirect("/admin?error=" + encodeURIComponent("Failed to load students"))
  }

  const students: Student[] = Array.isArray(studentsResponse.data)
    ? studentsResponse.data
    : []

  const renderCell = (student: Student, column: { key: string }) => {
    switch (column.key) {
      case "info": {
        const initials = student.full_name
          .split(" ")
          .map((name) => name[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={student.profile_image || "/placeholder.svg"}
                alt={student.full_name}
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-foreground">
                {student.full_name}
              </div>
              <div className="text-sm text-muted-foreground">
                ID: {student.id.slice(0, 8)}
              </div>
            </div>
          </div>
        )
      }
      case "gender":
        return (
          <Badge
            variant={student.gender === "MALE" ? "default" : "outline"}
          >
            {student.gender}
          </Badge>
        )
      case "address":
        return student.address ? (
          <span className="text-sm">
            {student.address.length > 30
              ? student.address.slice(0, 30) + "..."
              : student.address}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground italic">
            No address
          </span>
        )
      default:
        return String((student as any)[column.key] || "")
    }
  }

  return (
    <DataTable
      title="Students"
      data={students}
      columns={columns}
      searchPlaceholder="Search students by name, email, or phone..."
      createHref="/admin/students/new"
      viewHref={(id) => `/admin/students/${id}`}
      editHref={(id) => `/admin/students/${id}/edit`}
      renderCell={renderCell}
    />
  )
}
