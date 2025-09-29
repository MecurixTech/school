"use client";

import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";

// Static/mock data
const ITEM_PER_PAGE = 5;

type Student = {
  id: string;
  name: string;
};

type ParentList = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  students: Student[];
};

// Example static data
const MOCK_DATA: ParentList[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "08123456789",
    address: "123 Main St, Lagos",
    students: [
      { id: "s1", name: "Jane Doe" },
      { id: "s2", name: "Jack Doe" },
    ],
  },
  {
    id: "2",
    name: "Mary Smith",
    email: "mary@example.com",
    phone: "08098765432",
    address: "456 Elm St, Abuja",
    students: [{ id: "s3", name: "Sam Smith" }],
  },
  // Add more mock parents here
];

interface ParentListPageProps {
  searchParams: { [key: string]: string | undefined };
}

const ParentListPage = ({ searchParams }: ParentListPageProps) => {
  // For demo, let's assume the role is admin
  const role = "admin";

  const columns = [
    { header: "Info", accessor: "info" },
    { header: "Student Names", accessor: "students", className: "hidden md:table-cell" },
    { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
    { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: ParentList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">
        {item.students.map((student) => student.name).join(", ")}
      </td>
      <td className="hidden lg:table-cell">{item.phone}</td>
      <td className="hidden lg:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="parent" type="update" data={item} />
              <FormContainer table="parent" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  // Pagination & search simulation
  const { page, search } = searchParams;
  const currentPage = page ? parseInt(page) : 1;

  let filteredData = MOCK_DATA;
  if (search) {
    filteredData = filteredData.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
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
        <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="parent" type="create" />}
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

export default ParentListPage;
