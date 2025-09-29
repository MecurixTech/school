"use client";

import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";

const ITEM_PER_PAGE = 5;

type Class = {
  id: string;
  name: string;
};

type StudentList = {
  id: string;
  name: string;
  username: string;
  phone: string;
  address: string;
  img?: string;
  class: Class;
};

// Mock data
const MOCK_CLASSES: Class[] = [
  { id: "c1", name: "Primary 1" },
  { id: "c2", name: "Primary 2" },
];

const MOCK_STUDENTS: StudentList[] = [
  {
    id: "1",
    name: "John Doe",
    username: "john.doe",
    phone: "08123456789",
    address: "123 Main St, Lagos",
    img: "",
    class: MOCK_CLASSES[0],
  },
  {
    id: "2",
    name: "Mary Smith",
    username: "mary.smith",
    phone: "08098765432",
    address: "456 Elm St, Abuja",
    img: "",
    class: MOCK_CLASSES[1],
  },
  // Add more students as needed
];

interface StudentListPageProps {
  searchParams: { [key: string]: string | undefined };
}

const StudentListPage = ({ searchParams }: StudentListPageProps) => {
  const role = "admin"; // Hardcoded for demo purposes

  const columns = [
    { header: "Info", accessor: "info" },
    { header: "Student ID", accessor: "studentId", className: "hidden md:table-cell" },
    { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
    { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
    { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: StudentList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.img || "/noAvatar.png"}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.class.name}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.username}</td>
      <td className="hidden md:table-cell">{item.class.name[0]}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/students/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormContainer
              table="student"
              type="delete"
              id={item.id}
              relatedData={{ parents: [], grades: [], classes: MOCK_CLASSES }}
            />
          )}
        </div>
      </td>
    </tr>
  );

  const { page, search } = searchParams;
  const currentPage = page ? parseInt(page) : 1;

  // Filter by search
  let filteredData = MOCK_STUDENTS;
  if (search) {
    filteredData = filteredData.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE
  );

  const totalCount = filteredData.length;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormContainer
                table="student"
                type="create"
                relatedData={{ parents: [], grades: [], classes: MOCK_CLASSES }}
              />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={paginatedData} />
      {/* PAGINATION */}
      <Pagination page={currentPage} count={totalCount} />
    </div>
  );
};

export default StudentListPage;
