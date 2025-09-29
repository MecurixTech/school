"use client";

import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";

type Teacher = {
  id: string;
  name: string;
};

type Subject = {
  id: string;
  name: string;
  teachers: Teacher[];
};

// MOCK DATA
const MOCK_SUBJECTS: Subject[] = [
  { id: "sub1", name: "Mathematics", teachers: [{ id: "t1", name: "Mr. Smith" }, { id: "t2", name: "Mrs. Jones" }] },
  { id: "sub2", name: "English", teachers: [{ id: "t3", name: "Ms. Brown" }] },
  { id: "sub3", name: "Science", teachers: [{ id: "t4", name: "Dr. Green" }] },
];

const SubjectListPage = ({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) => {
  const role = "admin"; // Hardcoded role

  const columns = [
    { header: "Subject Name", accessor: "name" },
    { header: "Teachers", accessor: "teachers", className: "hidden md:table-cell" },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (item: Subject) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.teachers.map(t => t.name).join(", ")}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="subject" type="update" data={item} />
              <FormContainer table="subject" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  // Apply simple search filter if searchParams.search exists
  let filteredData = MOCK_SUBJECTS;
  const search = searchParams?.search;
  if (search) {
    filteredData = MOCK_SUBJECTS.filter(sub =>
      sub.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const ITEM_PER_PAGE = 10; // same as your setting
  const start = (page - 1) * ITEM_PER_PAGE;
  const end = start + ITEM_PER_PAGE;
  const paginatedData = filteredData.slice(start, end);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="subject" type="create" />}
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={paginatedData} />

      {/* PAGINATION */}
      <Pagination page={page} count={filteredData.length} />
    </div>
  );
};

export default SubjectListPage;
