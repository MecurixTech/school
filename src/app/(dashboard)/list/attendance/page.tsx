import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Attendance, Class, Lesson, Prisma, Student, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type AttendanceList = Attendance & {
  student: Student & { class: Class };
  lesson: Lesson & {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};

const AttendanceListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  console.log("Attendance page - Current user info:", {
    userId,
    role,
    currentUserId
  });

  const columns = [
    {
      header: "Student",
      accessor: "student",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Subject",
      accessor: "subject",
      className: "hidden md:table-cell",
    },
    {
      header: "Lesson",
      accessor: "lesson",
      className: "hidden md:table-cell",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden lg:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    {
      header: "Status",
      accessor: "status",
    },
    ...(role === "admin" || role === "teacher"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: AttendanceList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.student.name} {item.student.surname}</h3>
          <p className="text-xs text-gray-500">{item.student.id}</p>
        </div>
      </td>
      <td>{item.student.class.name}</td>
      <td className="hidden md:table-cell">{item.lesson.subject.name}</td>
      <td className="hidden md:table-cell">{item.lesson.name}</td>
      <td className="hidden lg:table-cell">
        {item.lesson.teacher.name} {item.lesson.teacher.surname}
      </td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.date)}
      </td>
      <td>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            item.present
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.present ? "Present" : "Absent"}
        </span>
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormContainer table="attendance" type="update" data={item} />
              <FormContainer table="attendance" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION
  const query: Prisma.AttendanceWhereInput = {};
  query.lesson = {};

  console.log("Attendance query before params filtering:", query);

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lesson.classId = parseInt(value);
            break;
          case "teacherId":
            query.lesson.teacherId = value;
            break;
          case "search":
            query.OR = [
              {
                student: {
                  name: { contains: value, mode: "insensitive" },
                },
              },
              {
                student: {
                  surname: { contains: value, mode: "insensitive" },
                },
              },
              {
                lesson: {
                  subject: {
                    name: { contains: value, mode: "insensitive" },
                  },
                },
              },
            ];
            break;
          case "present":
            query.present = value === "true";
            break;
          case "date":
            // Filter by specific date
            const targetDate = new Date(value);
            const nextDay = new Date(targetDate);
            nextDay.setDate(nextDay.getDate() + 1);
            query.date = {
              gte: targetDate,
              lt: nextDay,
            };
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS
  console.log("Attendance query before role filtering:", query);

  switch (role) {
    case "admin":
      console.log("Admin user - showing all attendance records");
      break;
    case "teacher":
      console.log("Teacher user - filtering by teacherId:", currentUserId);
      query.lesson.teacherId = currentUserId!;
      break;
    case "student":
      console.log("Student user - filtering by studentId:", currentUserId);
      query.studentId = currentUserId!;
      break;
    case "parent":
      console.log("Parent user - filtering by parent's children");
      query.student = {
        parentId: currentUserId!,
      };
      break;
    default:
      console.log("Unknown role - showing all attendance records");
      break;
  }

  console.log("Final attendance query:", query);

  const [data, count] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: query,
      include: {
        student: {
          include: {
            class: true,
          },
        },
        lesson: {
          include: {
            subject: true,
            class: true,
            teacher: true,
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: { date: "desc" }, // Show most recent attendance first
    }),
    prisma.attendance.count({ where: query }),
  ]);

  console.log("Attendance records found:", data.length);
  console.log("Total attendance count:", count);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Attendance Records
        </h1>
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
              <FormContainer table="attendance" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* FILTER SUMMARY */}
      <div className="flex flex-wrap gap-2 mt-4 mb-4">
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          Total: {count} records
        </div>
        {queryParams.present && (
          <div className="text-xs text-white bg-blue-500 px-2 py-1 rounded">
            Status: {queryParams.present === "true" ? "Present" : "Absent"}
          </div>
        )}
        {queryParams.date && (
          <div className="text-xs text-white bg-purple-500 px-2 py-1 rounded">
            Date: {new Date(queryParams.date).toLocaleDateString()}
          </div>
        )}
        {queryParams.classId && (
          <div className="text-xs text-white bg-green-500 px-2 py-1 rounded">
            Class ID: {queryParams.classId}
          </div>
        )}
      </div>

      {/* QUICK FILTERS */}
      <div className="flex flex-wrap gap-2 mb-4">
        <a
          href="/list/attendance?present=true"
          className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-full transition-colors"
        >
          Present Only
        </a>
        <a
          href="/list/attendance?present=false"
          className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-full transition-colors"
        >
          Absent Only
        </a>
        <a
          href={`/list/attendance?date=${new Date().toISOString().split("T")[0]}`}
          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full transition-colors"
        >
          Today
        </a>
        <a
          href="/list/attendance"
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full transition-colors"
        >
          Clear Filters
        </a>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AttendanceListPage;