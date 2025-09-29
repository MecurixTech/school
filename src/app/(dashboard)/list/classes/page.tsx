import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";

type ClassList = {
  id: string;
  name: string;
  capacity: number;
  grade: string;
  supervisor: { name: string; surname: string };
};

// MOCK DATA
const MOCK_CLASSES: ClassList[] = [
  { id: "1", name: "Class 5A", capacity: 30, grade: "5", supervisor: { name: "John", surname: "Doe" } },
  { id: "2", name: "Class 6B", capacity: 28, grade: "6", supervisor: { name: "Jane", surname: "Smith" } },
  { id: "3", name: "Class 4C", capacity: 25, grade: "4", supervisor: { name: "Mike", surname: "Johnson" } },
];

const ClassListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // MOCK ROLE
  const role: "admin" | "teacher" | "student" | "parent" = "admin";

  const columns = [
    { header: "Class Name", accessor: "name" },
    { header: "Capacity", accessor: "capacity", className: "hidden md:table-cell" },
    { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
    { header: "Supervisor", accessor: "supervisor", className: "hidden md:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: ClassList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.capacity}</td>
      <td className="hidden md:table-cell">{item.grade}</td>
      <td className="hidden md:table-cell">{item.supervisor.name} {item.supervisor.surname}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="class" type="update" data={item} />
              <FormContainer table="class" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const ITEM_PER_PAGE = 10;

  // Optional: filter by searchParams
  const filteredData = MOCK_CLASSES.filter(c => 
    !searchParams.search || c.name.toLowerCase().includes(searchParams.search.toLowerCase())
  );

  const data = filteredData.slice(ITEM_PER_PAGE * (page - 1), ITEM_PER_PAGE * page);
  const count = filteredData.length;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="class" type="create" />}
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={page} count={count} />
    </div>
  );
};

export default ClassListPage;
