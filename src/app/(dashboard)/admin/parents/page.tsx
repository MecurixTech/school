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
  { key: "genderBadge", label: "Gender" },
]

export default async function ParentsPage() {
  await serverAuthClient.requireAuth()

  const response = await serverAuthClient.getParents()

  if (response.error) {
    redirect("/admin?error=" + encodeURIComponent("Failed to load parents"))
  }

  const parents: Parent[] = Array.isArray(response.data) ? response.data : []

  // Precompute safe data for DataTable
  const parentsWithExtras = parents.map((parent) => {
    const initials = parent.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

    return {
      ...parent,
      info: (
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
      ),
      genderBadge: (
        <Badge variant={parent.gender === "MALE" ? "default" : "secondary"}>
          {parent.gender}
        </Badge>
      ),
      viewHref: `/admin/parents/${parent.id}`,
      editHref: `/admin/parents/${parent.id}/edit`,
    }
  })

  return (
    <DataTable
      title="Parents"
      data={parentsWithExtras}
      columns={columns}
      searchPlaceholder="Search parents..."
      createHref="/admin/parents/new"
      viewKey="viewHref"
      editKey="editHref"
    />
  )
}
