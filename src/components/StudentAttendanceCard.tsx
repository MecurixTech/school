const StudentAttendanceCard = ({ id }: { id: string }) => {
  // Demo attendance data for the student
  const attendance = [
    { date: new Date("2025-01-10"), present: true },
    { date: new Date("2025-01-11"), present: false },
    { date: new Date("2025-01-12"), present: true },
    { date: new Date("2025-01-13"), present: true },
    { date: new Date("2025-01-14"), present: false },
  ];

  const totalDays = attendance.length;
  const presentDays = attendance.filter((day) => day.present).length;
  const percentage = totalDays ? (presentDays / totalDays) * 100 : 0;

  return (
    <div className="">
      <h1 className="text-xl font-semibold">{percentage.toFixed(0) || "-"}%</h1>
      <span className="text-sm text-gray-400">Attendance</span>
    </div>
  );
};

export default StudentAttendanceCard;
