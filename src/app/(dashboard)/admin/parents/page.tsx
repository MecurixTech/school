import { serverAuthClient } from "@/lib/auth-server"
import { DataTable } from "@/components/data-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { redirect } from "next/navigation"

interface Parent {
  id: string
  email: string
  full_name: string
  phone_number: string
  spouse_name?: string
  gender: "MALE" | "FEMALE"
  profile_image?: string
}

const columns = [
  { key: "info", label: "Parent Info" },
  { key: "email", label: "Email" },
  { key: "phone_number", label: "Phone" },
  { key: "spouse_name", label: "Spouse" },
  { key: "gender", label: "Gender" },
]

export default async function ParentsPage() {
  await serverAuthClient.requireAuth()

  const response = await serverAuthClient.getParents()

  if (response.error) {
    redirect("/admin?error=" + encodeURIComponent("Failed to load parents"))
  }

  const parents: Parent[] = Array.isArray(response.data) ? response.data : []

  const renderCell = (parent: Parent, column: any) => {
    switch (column.key) {
      case "info":
        const initials = parent.full_name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={parent.profile_image || "/placeholder.svg"}
                alt={parent.full_name}
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-foreground">{parent.full_name}</div>
              <div className="text-sm text-muted-foreground">
                ID: {parent.id.slice(0, 8)}
              </div>
            </div>
          </div>
        )
      case "gender":
        return (
          <Badge variant={parent.gender === "MALE" ? "default" : "secondary"}>
            {parent.gender}
          </Badge>
        )
      default:
        return String((parent as any)[column.key] || "")
    }
  }

  return (
    <DataTable
      title="Parents"
      data={parents}
      columns={columns}
      searchPlaceholder="Search parents..."
      createHref="/admin/parents/new"
      viewHref={(id) => `/admin/parents/${id}`}
      editHref={(id) => `/admin/parents/${id}/edit`}
      renderCell={renderCell}
    />
  )
}
