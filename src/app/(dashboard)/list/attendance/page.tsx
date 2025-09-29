import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";

type AttendanceList = {
  id: string;
  date: Date;
  present: boolean;
  student: { id: string; name: string; surname: string; class: { name: string } };
  lesson: { name: string; subject: { name: string }; class: { name: string }; teacher: { name: string; surname: string } };
};

// MOCK DATA
const MOCK_ATTENDANCE: AttendanceList[] = [
  {
    id: "1",
    date: new Date("2025-10-05"),
    present: true,
    student: { id: "S001", name: "Alice", surname: "Brown", class: { name: "Class 5A" } },
    lesson: { name: "Math Lesson 1", subject: { name: "Mathematics" }, class: { name: "Class 5A" }, teacher: { name: "John", surname: "Doe" } },
  },
  {
    id: "2",
    date: new Date("2025-10-05"),
    present: false,
    student: { id: "S002", name: "Bob", surname: "Smith", class: { name: "Class 6B" } },
    lesson: { name: "Science Lesson 1", subject: { name: "Science" }, class: { name: "Class 6B" }, teacher: { name: "Jane", surname: "Smith" } },
  },
  {
    id: "3",
    date: new Date("2025-10-06"),
    present: true,
    student: { id: "S003", name: "Charlie", surname: "Johnson", class: { name: "Class 5C" } },
    lesson: { name: "History Lesson 1", subject: { name: "History" }, class: { name: "Class 5C" }, teacher: { name: "Mike", surname: "Johnson" } },
  },
];

const AttendanceListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // MOCK ROLE
  const role: "admin" | "teacher" | "student" | "parent" = "admin";

  const columns = [
    { header: "Student", accessor: "student" },
    { header: "Class", accessor: "class" },
    { header: "Subject", accessor: "subject", className: "hidden md:table-cell" },
    { header: "Lesson", accessor: "lesson", className: "hidden md:table-cell" },
    { header: "Teacher", accessor: "teacher", className: "hidden lg:table-cell" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" },
    { header: "Status", accessor: "status" },
    ...(role === "admin" || role === "teacher" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: AttendanceList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.student.name} {item.student.surname}</h3>
          <p className="text-xs text-gray-500">{item.student.id}</p>
        </div>
      </td>
      <td>{item.student.class.name}</td>
      <td className="hidden md:table-cell">{item.lesson.subject.name}</td>
      <td className="hidden md:table-cell">{item.lesson.name}</td>
      <td className="hidden lg:table-cell">{item.lesson.teacher.name} {item.lesson.teacher.surname}</td>
      <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.date)}</td>
      <td>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.present ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {item.present ? "Present" : "Absent"}
        </span>
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormContainer table="attendance" type="update" data={item} />
              <FormContainer table="attendance" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const ITEM_PER_PAGE = 10;
  const filteredData = MOCK_ATTENDANCE; // optionally filter by searchParams
  const data = filteredData.slice(ITEM_PER_PAGE * (page - 1), ITEM_PER_PAGE * page);
  const count = filteredData.length;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Attendance Records</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && <FormContainer table="attendance" type="create" />}
          </div>
        </div>
      </div>

      {/* QUICK FILTERS */}
      <div className="flex flex-wrap gap-2 mt-4 mb-4">
        <a href="/list/attendance?present=true" className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-full transition-colors">Present Only</a>
        <a href="/list/attendance?present=false" className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-full transition-colors">Absent Only</a>
        <a href={`/list/attendance?date=${new Date().toISOString().split("T")[0]}`} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full transition-colors">Today</a>
        <a href="/list/attendance" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full transition-colors">Clear Filters</a>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={page} count={count} />
    </div>
  );
};

export default AttendanceListPage;
