import { userService } from "@/lib/services/user-service"
import { serverAuthClient } from "@/lib/auth-server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { notFound, redirect } from "next/navigation"

interface ParentPageProps {
  params: {
    id: string
  }
}

export default async function ParentPage({ params }: ParentPageProps) {
  await serverAuthClient.requireAuth()

  const parent = await userService.getParentById(params.id)

  if (!parent) {
    
    notFound()
  }

  const initials = parent.full_name
    ? parent.full_name
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
            src={parent.profile_image || "/placeholder.svg"}
            alt={parent.full_name}
          />
          <AvatarFallback className="bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold">{parent.full_name}</h1>
          <p className="text-muted-foreground text-sm">ID: {parent.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="font-medium">Email</p>
          <p className="text-muted-foreground">{parent.email}</p>
        </div>
        <div>
          <p className="font-medium">Phone Number</p>
          <p className="text-muted-foreground">{parent.phone_number ?? "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Spouse Name</p>
          <p className="text-muted-foreground">{parent.spouse_name ?? "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Spouse Email</p>
          <p className="text-muted-foreground">{parent.spouse_email ?? "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Spouse Phone</p>
          <p className="text-muted-foreground">{parent.spouse_phone_number ?? "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Gender</p>
          {parent.gender ? (
            <Badge variant={parent.gender === "MALE" ? "default" : "secondary"}>
              {parent.gender}
            </Badge>
          ) : (
            <Badge variant="outline">N/A</Badge>
          )}
        </div>
        <div>
          <p className="font-medium">Address</p>
          <p className="text-muted-foreground">{parent.address ?? "N/A"}</p>
        </div>
        <div>
          <p className="font-medium">Date of Birth</p>
          <p className="text-muted-foreground">
            {parent.date_of_birth
              ? new Date(parent.date_of_birth).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  )
}
