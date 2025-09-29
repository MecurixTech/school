import FormContainer from "@/components/FormContainer"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import TableSearch from "@/components/TableSearch"
import Image from "next/image"

type AnnouncementList = {
  id: string
  title: string
  class: { name: string } | null
  date: Date
}

// Mock static data
const MOCK_ANNOUNCEMENTS: AnnouncementList[] = [
  {
    id: "1",
    title: "Math Exam Announcement",
    class: { name: "Class 5A" },
    date: new Date("2025-09-29"),
  },
  {
    id: "2",
    title: "Science Fair",
    class: { name: "Class 6B" },
    date: new Date("2025-09-25"),
  },
  {
    id: "3",
    title: "Sports Day",
    class: null,
    date: new Date("2025-09-20"),
  },
]

const AnnouncementListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) => {
  // Mock role for testing
  const role: "admin" | "teacher" | "student" | "parent" = "admin"

  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ]

  const renderRow = (item: AnnouncementList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.class?.name || "-"}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.date)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="announcement" type="update" data={item} />
              <FormContainer table="announcement" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  )

  const page = searchParams.page ? Number(searchParams.page) : 1
  const ITEM_PER_PAGE = 10
  const data = MOCK_ANNOUNCEMENTS.slice(
    ITEM_PER_PAGE * (page - 1),
    ITEM_PER_PAGE * page
  )
  const count = MOCK_ANNOUNCEMENTS.length

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Announcements</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="announcement" type="create" />}
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

export default AnnouncementListPage
