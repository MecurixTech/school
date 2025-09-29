import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";

type EventList = {
  id: string;
  title: string;
  class: { name: string } | null;
  startTime: Date;
  endTime: Date;
};

// MOCK DATA
const MOCK_EVENTS: EventList[] = [
  {
    id: "1",
    title: "Math Olympiad",
    class: { name: "Class 5A" },
    startTime: new Date("2025-10-30T09:00:00"),
    endTime: new Date("2025-10-30T11:00:00"),
  },
  {
    id: "2",
    title: "Science Fair",
    class: { name: "Class 6B" },
    startTime: new Date("2025-11-01T10:00:00"),
    endTime: new Date("2025-11-01T13:00:00"),
  },
  {
    id: "3",
    title: "Sports Day",
    class: null,
    startTime: new Date("2025-11-05T08:00:00"),
    endTime: new Date("2025-11-05T12:00:00"),
  },
];

const EventListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // MOCK ROLE
  const role: "admin" | "teacher" | "student" | "parent" = "admin";

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Class", accessor: "class" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" },
    { header: "Start Time", accessor: "startTime", className: "hidden md:table-cell" },
    { header: "End Time", accessor: "endTime", className: "hidden md:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: EventList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.class?.name || "-"}</td>
      <td className="hidden md:table-cell">{item.startTime.toDateString()}</td>
      <td className="hidden md:table-cell">
        {item.startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
      </td>
      <td className="hidden md:table-cell">
        {item.endTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
      </td>
      <td>
        {role === "admin" && (
          <div className="flex items-center gap-2">
            <FormContainer table="event" type="update" data={item} />
            <FormContainer table="event" type="delete" id={item.id} />
          </div>
        )}
      </td>
    </tr>
  );

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const ITEM_PER_PAGE = 10;

  // FILTER
  const filteredData = MOCK_EVENTS.filter((e) =>
    !searchParams.search || e.title.toLowerCase().includes(searchParams.search.toLowerCase())
  );

  const data = filteredData.slice(ITEM_PER_PAGE * (page - 1), ITEM_PER_PAGE * page);
  const count = filteredData.length;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="event" type="create" />}
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={page} count={count} />
    </div>
  );
};

export default EventListPage;
