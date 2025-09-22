import { getUnreadAnnouncementCount } from "@/lib/announcement-utils"

const AnnouncementBadge = async () => {
  const count = await getUnreadAnnouncementCount()

  if (count === 0) return null

  return (
    <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
      {count > 99 ? "99+" : count}
    </div>
  )
}

export default AnnouncementBadge
