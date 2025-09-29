"use client";

import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";

type ExamList = {
  id: string;
  lesson: {
    subject: { name: string };
    class: { name: string };
    teacher: { name: string; surname: string };
  };
  startTime: Date;
};

// MOCK DATA
const MOCK_EXAMS: ExamList[] = [
  {
    id: "1",
    lesson: {
      subject: { name: "Mathematics" },
      class: { name: "Class 5A" },
      teacher: { name: "Alice", surname: "Johnson" },
    },
    startTime: new Date("2025-11-01T09:00:00"),
  },
  {
    id: "2",
    lesson: {
      subject: { name: "Science" },
      class: { name: "Class 6B" },
      teacher: { name: "Bob", surname: "Smith" },
    },
    startTime: new Date("2025-11-02T10:00:00"),
  },
];

const ExamListPage = ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  // MOCK ROLE
  const role: "admin" | "teacher" | "student" | "parent" = "admin";
  const ITEM_PER_PAGE = 10;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const columns = [
    { header: "Subject Name", accessor: "name" },
    { header: "Class", accessor: "class" },
    { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" },
    ...(role === "admin" || role === "teacher" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const filteredData = MOCK_EXAMS.filter((exam) =>
    !searchParams.search || exam.lesson.subject.name.toLowerCase().includes(searchParams.search.toLowerCase())
  );

  const data = filteredData.slice(ITEM_PER_PAGE * (page - 1), ITEM_PER_PAGE * page);
  const count = filteredData.length;

  const renderRow = (item: ExamList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">{item.lesson.subject.name}</td>
      <td>{item.lesson.class.name}</td>
      <td className="hidden md:table-cell">{item.lesson.teacher.name} {item.lesson.teacher.surname}</td>
      <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.startTime)}</td>
      <td>
        {(role === "admin" || role === "teacher") && (
          <div className="flex items-center gap-2">
            <FormContainer table="exam" type="update" data={item} />
            <FormContainer table="exam" type="delete" id={item.id} />
          </div>
        )}
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && <FormContainer table="exam" type="create" />}
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

export default ExamListPage;
