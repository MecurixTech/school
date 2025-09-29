type Role = "admin" | "teacher" | "student" | "parent";

export function getUnreadAnnouncementCount(
  userId?: string,
  role?: Role
): number {
  if (!userId) return 0;

  // Static announcements data
  const announcements = [
    { id: "a1", date: new Date(), classId: null },
    { id: "a2", date: new Date(), classId: "c1" },
    { id: "a3", date: new Date(new Date().setDate(new Date().getDate() - 5)), classId: "c2" },
    { id: "a4", date: new Date(new Date().setDate(new Date().getDate() - 10)), classId: "c1" }, // older than 7 days
  ];

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Static role-based conditions
  const roleConditions: Record<Role, string[]> = {
    teacher: ["c1"], // teacher's classes
    student: ["c1"], // student's classes
    parent: ["c2"], // parent's children's classes
    admin: [],
  };

  const allowedClasses = role && role !== "admin" ? roleConditions[role] : null;

  const count = announcements.filter((ann) => {
    const isRecent = ann.date >= sevenDaysAgo;
    const isAllowed =
      !allowedClasses || ann.classId === null || allowedClasses.includes(ann.classId);
    return isRecent && isAllowed;
  }).length;

  return count;
}
