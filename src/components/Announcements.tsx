import React from "react";

const Announcements = () => {
  // Static demo role
  const role = "teacher"; // or "student", "parent", "admin"

  // Demo announcements data
  const announcements = [
    { id: 1, title: "New Semester Starts", description: "Welcome back!" },
    { id: 2, title: "Holiday Notice", description: "School will be closed on Friday" },
    { id: 3, title: "Exam Schedule", description: "Check your email for details" },
  ];

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
        >
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-gray-600">{announcement.title}</h1>
          </div>
          <p className="mt-2 text-gray-400 text-sm">{announcement.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Announcements;
