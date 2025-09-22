import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";

const MessagesPage = async () => {
  const columns = [
    {
      header: "Sender",
      accessor: "sender",
    },
    {
      header: "Last Message",
      accessor: "lastMessage",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden lg:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
    },
  ];

  const mockConversations = [
    {
      id: "1",
      sender: "John Doe",
      senderImg: "/avatar.png",
      lastMessage: "Hey, how are you doing?",
      date: "2025-09-21T10:30:00Z",
    },
    {
      id: "2",
      sender: "Math Department",
      senderImg: "/assignment.png",
      lastMessage: "New assignment posted: Calculus Homework",
      date: "2025-09-20T14:00:00Z",
    },
    {
      id: "3",
      sender: "Sarah Wilson",
      senderImg: "/avatar.png",
      lastMessage: "Can we meet after class?",
      date: "2025-09-19T16:00:00Z",
    },
  ];

  const renderRow = (item: typeof mockConversations[0]) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.senderImg || "/noAvatar.png"}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <h3 className="font-semibold">{item.sender}</h3>
      </td>
      <td className="hidden md:table-cell">{item.lastMessage}</td>
      <td className="hidden md:table-cell">{new Date(item.date).toLocaleDateString()}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/messages/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Messages</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FormContainer table="message" type="create" />
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={mockConversations} />
      {/* PAGINATION */}
      <Pagination page={1} count={mockConversations.length} />
    </div>
  );
};

export default MessagesPage;
