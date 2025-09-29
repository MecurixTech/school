import BigCalendar from "./BigCalender";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

const BigCalendarContainer = ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  // Static demo lessons
  const demoLessons = [
    {
      name: "Math",
      startTime: new Date("2025-09-29T08:00:00"),
      endTime: new Date("2025-09-29T09:30:00"),
      teacherId: "t1",
      classId: 1,
    },
    {
      name: "English",
      startTime: new Date("2025-09-29T10:00:00"),
      endTime: new Date("2025-09-29T11:30:00"),
      teacherId: "t2",
      classId: 1,
    },
    {
      name: "Science",
      startTime: new Date("2025-09-30T08:00:00"),
      endTime: new Date("2025-09-30T09:30:00"),
      teacherId: "t1",
      classId: 2,
    },
  ];

  // Filter demo lessons based on type and id
  const filteredLessons = demoLessons.filter((lesson) =>
    type === "teacherId" ? lesson.teacherId === id : lesson.classId === id
  );

  const data = filteredLessons.map((lesson) => ({
    title: lesson.name,
    start: lesson.startTime,
    end: lesson.endTime,
  }));

  const schedule = adjustScheduleToCurrentWeek(data);

  return (
    <div className="">
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;
