"use client";

import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";

type Subject = { id: string; name: string };
type ClassType = { id: string; name: string };
type Teacher = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  img?: string;
  subjects: Subject[];
  classes: ClassType[];
};

// MOCK DATA
const MOCK_TEACHERS: Teacher[] = [
  {
    id: "t1",
    name: "Mr. Smith",
    username: "smith01",
    email: "smith@example.com",
    phone: "08123456789",
    address: "123 Main St",
    img: "",
    subjects: [{ id: "sub1", name: "Mathematics" }],
    classes: [{ id: "c1", name: "Grade 10" }, { id: "c2", name: "Grade 11" }],
  },
  {
    id: "t2",
    name: "Mrs. Jones",
    username: "jones02",
    email: "jones@example.com",
    subjects: [{ id: "sub2", name: "English" }],
    classes: [{ id: "c1", name: "Grade 10" }],
  },
];

const TeacherListPage = ({ searchParams }: { searchParams?: { [key: string]: string } }) => {
  const role = "admin"; // Hardcoded for client-side demo

  const columns = [
    { header: "Info", accessor: "info" },
    { header: "Teacher ID", accessor: "teacherId", className: "hidden md:table-cell" },
    { header: "Subjects", accessor: "subjects", className: "hidden md:table-cell" },
    { header: "Classes", accessor: "classes", className: "hidden md:table-cell" },
    { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
    { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: Teacher) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
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
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.username}</td>
      <td className="hidden md:table-cell">{item.subjects.map(s => s.name).join(", ")}</td>
      <td className="hidden md:table-cell">{item.classes.map(c => c.name).join(", ")}</td>
      <td className="hidden md:table-cell">{item.phone || "-"}</td>
      <td className="hidden md:table-cell">{item.address || "-"}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && <FormContainer table="teacher" type="delete" id={item.id} />}
        </div>
      </td>
    </tr>
  );

  // Simple search
  let filteredData = MOCK_TEACHERS;
  const search = searchParams?.search;
  if (search) {
    filteredData = MOCK_TEACHERS.filter(teacher =>
      teacher.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const ITEM_PER_PAGE = 10;
  const paginatedData = filteredData.slice((page - 1) * ITEM_PER_PAGE, page * ITEM_PER_PAGE);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="teacher" type="create" />}
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

export default TeacherListPage;
