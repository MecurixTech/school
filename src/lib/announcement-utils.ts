import prisma from "./prisma"
import { auth } from "@clerk/nextjs/server"

export async function getUnreadAnnouncementCount() {
  const { userId, sessionClaims } = auth()
  const role = (sessionClaims?.metadata as { role?: string })?.role

  if (!userId) return 0

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId } } },
    student: { students: { some: { id: userId } } },
    parent: { students: { some: { parentId: userId } } },
  }

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const count = await prisma.announcement.count({
    where: {
      date: {
        gte: sevenDaysAgo,
      },
      ...(role !== "admin" && {
        OR: [{ classId: null }, { class: roleConditions[role as keyof typeof roleConditions] || {} }],
      }),
    },
  })

  return count
}
