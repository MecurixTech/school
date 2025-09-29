import FormContainer from "@/components/FormContainer"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import TableSearch from "@/components/TableSearch"
import Image from "next/image"

type AssignmentList = {
  id: string
  dueDate: Date
  lesson: {
    subject: { name: string }
    class: { name: string }
    teacher: { name: string; surname: string }
  }
}

// MOCK DATA
const MOCK_ASSIGNMENTS: AssignmentList[] = [
  {
    id: "1",
    dueDate: new Date("2025-10-05"),
    lesson: {
      subject: { name: "Mathematics" },
      class: { name: "Class 5A" },
      teacher: { name: "John", surname: "Doe" },
    },
  },
  {
    id: "2",
    dueDate: new Date("2025-10-10"),
    lesson: {
      subject: { name: "Science" },
      class: { name: "Class 6B" },
      teacher: { name: "Jane", surname: "Smith" },
    },
  },
  {
    id: "3",
    dueDate: new Date("2025-10-15"),
    lesson: {
      subject: { name: "History" },
      class: { name: "Class 5C" },
      teacher: { name: "Mike", surname: "Johnson" },
    },
  },
]

const AssignmentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) => {
  // MOCK ROLE
  const role: "admin" | "teacher" | "student" | "parent" = "admin"

  const columns = [
    { header: "Subject Name", accessor: "name" },
    { header: "Class", accessor: "class" },
    { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
    { header: "Due Date", accessor: "dueDate", className: "hidden md:table-cell" },
    ...(role === "admin" || role === "teacher" ? [{ header: "Actions", accessor: "action" }] : []),
  ]

  const renderRow = (item: AssignmentList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.lesson.subject.name}</td>
      <td>{item.lesson.class.name}</td>
      <td className="hidden md:table-cell">
        {item.lesson.teacher.name} {item.lesson.teacher.surname}
      </td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.dueDate)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormContainer table="assignment" type="update" data={item} />
              <FormContainer table="assignment" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  )

  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const ITEM_PER_PAGE = 10
  const data = MOCK_ASSIGNMENTS.slice(ITEM_PER_PAGE * (page - 1), ITEM_PER_PAGE * page)
  const count = MOCK_ASSIGNMENTS.length

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Assignments</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && (
              <FormContainer table="assignment" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={page} count={count} />
    </div>
  )
}

export default AssignmentListPage
