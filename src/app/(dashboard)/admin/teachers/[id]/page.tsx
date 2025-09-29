import { serverAuthClient } from "@/lib/auth-server"
import { userService } from "@/lib/services/user-service"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"

interface TeacherPageProps {
  params: {
    id: string
  }
}

export default async function TeacherPage({ params }: TeacherPageProps) {
  await serverAuthClient.requireAuth()

  const teacher = await userService.getTeacherById(params.id)

  if (!teacher) {
    notFound()
  }

  const initials = teacher.full_name
    ? teacher.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "?"

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={teacher.profile_image || "/placeholder.svg"}
            alt={teacher.full_name}
          />
          <AvatarFallback className="bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold">{teacher.full_name}</h1>
          <p className="text-muted-foreground text-sm">ID: {teacher.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="font-medium">Email</p>
          <p className="text-muted-foreground">{teacher.email}</p>
        </div>
        <div>
          <p className="font-medium">Phone Number</p>
          <p className="text-muted-foreground">{teacher.phone_number ?? "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Address</p>
          <p className="text-muted-foreground">{teacher.address ?? "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Date of Birth</p>
          <p className="text-muted-foreground">
            {teacher.date_of_birth
              ? new Date(teacher.date_of_birth).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  )
}
