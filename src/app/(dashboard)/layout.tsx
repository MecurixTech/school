import Menu from "@/components/Menu";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import type React from "react"
import { serverAuthClient } from "@/lib/auth-server"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await serverAuthClient.requireAuth()

  return (
    <div className="min-h-screen flex">
     
      <div className="w-20 lg:w-60 p-4 flex-shrink-0 bg-white border-r">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src="/logo.jpg" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-bold">Mecurix</span>
        </Link>
        <Menu />
      </div>

      <div className="flex-1 bg-[#F7F8FA] flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
        <Toaster />
      </div>
    </div>
  )
}
