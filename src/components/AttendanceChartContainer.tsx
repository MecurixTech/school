import Image from "next/image";
import AttendanceChart from "./AttendanceChart";

const AttendanceChartContainer = () => {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  // Static attendance data for demo purposes
  const attendanceMap: { [key: string]: { present: number; absent: number } } = {
    Mon: { present: 15, absent: 5 },
    Tue: { present: 14, absent: 6 },
    Wed: { present: 16, absent: 4 },
    Thu: { present: 13, absent: 7 },
    Fri: { present: 17, absent: 3 },
  };

  const data = daysOfWeek.map((day) => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent,
  }));

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <AttendanceChart data={data} />
    </div>
  );
};

export default AttendanceChartContainer;
