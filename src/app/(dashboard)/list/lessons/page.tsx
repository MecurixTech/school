"use client";

import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";

type LessonList = {
  id: string;
  subject: { name: string };
  class: { name: string };
  teacher: { name: string; surname: string };
};

// MOCK DATA
const MOCK_LESSONS: LessonList[] = [
  {
    id: "1",
    subject: { name: "Mathematics" },
    class: { name: "Class 5A" },
    teacher: { name: "Alice", surname: "Johnson" },
  },
  {
    id: "2",
    subject: { name: "Science" },
    class: { name: "Class 6B" },
    teacher: { name: "Bob", surname: "Smith" },
  },
];

const LessonListPage = ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const role: "admin" | "teacher" | "student" | "parent" = "admin"; // mock role
  const ITEM_PER_PAGE = 10;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const columns = [
    { header: "Subject Name", accessor: "subjectName" },
    { header: "Class", accessor: "className" },
    { header: "Teacher", accessor: "teacherName", className: "hidden md:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "actions" }] : []),
  ];

  // Filter by search query if provided
  const filteredData = MOCK_LESSONS.filter(
    (lesson) =>
      !searchParams.search ||
      lesson.subject.name.toLowerCase().includes(searchParams.search.toLowerCase()) ||
      lesson.teacher.name.toLowerCase().includes(searchParams.search.toLowerCase())
  );

  const data = filteredData.slice(ITEM_PER_PAGE * (page - 1), ITEM_PER_PAGE * page);
  const count = filteredData.length;

  const renderRow = (item: LessonList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">{item.subject.name}</td>
      <td>{item.class.name}</td>
      <td className="hidden md:table-cell">{item.teacher.name} {item.teacher.surname}</td>
      <td>
        {role === "admin" && (
          <div className="flex items-center gap-2">
            <FormContainer table="lesson" type="update" data={item} />
            <FormContainer table="lesson" type="delete" id={item.id} />
          </div>
        )}
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="lesson" type="create" />}
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* PAGINATION */}
      <Pagination page={page} count={count} />
    </div>
  );
};

export default LessonListPage;
