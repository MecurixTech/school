
import { serverAuthClient } from "@/lib/auth-server"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await serverAuthClient.getCurrentUser()

  if (!user || user.role !== "admin") {
    redirect("/login?error=Unauthorized")
  }

  return <>{children}</>
}
