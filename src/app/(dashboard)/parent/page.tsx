"use client";

import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";

type Student = {
  id: string;
  name: string;
  surname: string;
  classId: string;
};

// MOCK STUDENTS DATA
const MOCK_STUDENTS: Student[] = [
  { id: "s1", name: "Jane", surname: "Doe", classId: "c1" },
  { id: "s2", name: "John", surname: "Doe", classId: "c2" },
];

const ParentPage = () => {
  // Replace this with API fetch for real data
  const students = MOCK_STUDENTS;

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="flex-1 flex flex-col gap-4">
        {students.map((student) => (
          <div className="w-full xl:w-2/3" key={student.id}>
            <div className="h-full bg-white p-4 rounded-md">
              <h1 className="text-xl font-semibold">
                Schedule ({student.name} {student.surname})
              </h1>
              <BigCalendarContainer type="classId" id={student.classId} />
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
