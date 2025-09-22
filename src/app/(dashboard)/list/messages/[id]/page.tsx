
import Image from "next/image";
import Link from "next/link";

const SingleMessagePage = async ({ params }: { params: { id: string } }) => {
  // MOCK DATA
  const conversation = {
    id: "1",
    sender: "John Doe",
    senderImg: "/avatar.png",
    messages: [
      {
        id: "1",
        content: "Hey, how are you doing?",
        createdAt: "2025-09-21T10:30:00Z",
        senderId: "user2",
      },
      {
        id: "2",
        content: "I'm doing great, thanks for asking! How about you?",
        createdAt: "2025-09-21T10:32:00Z",
        senderId: "user1", 
      },
      {
        id: "3",
        content: "I'm good too. Just working on the new project.",
        createdAt: "2025-09-21T10:33:00Z",
        senderId: "user2",
      },
    ],
  };

  const currentUser = {
    id: "user1",
    img: "/noAvatar.png",
  };

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT (Chat Area) */}
      <div className="w-full xl:w-2/3 bg-white rounded-md p-4 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center gap-4 border-b pb-4">
          <Image
            src={conversation.senderImg || "/noAvatar.png"}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          <h1 className="text-xl font-semibold">{conversation.sender}</h1>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === currentUser.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg shadow max-w-xs ${
                  message.senderId === currentUser.id
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-gray-200 text-gray-800 rounded-tl-none"
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs text-right mt-1 opacity-70">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Message Input */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-md"
            />
            <button className="bg-blue-500 text-white p-2 rounded-md">
              Send
            </button>
          </div>
        </div>
      </div>
      {/* RIGHT (Conversation Details) */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Conversation Details</h1>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <p>
              <strong>Participant:</strong> {conversation.sender}
            </p>
            <p>
              <strong>Started:</strong>{" "}
              {new Date(
                conversation.messages[0].createdAt
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleMessagePage;
