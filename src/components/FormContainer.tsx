import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  console.log("FormContainer - Auth info:", {
    userId,
    role,
    currentUserId,
    table,
    type,
  });

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: subjectTeachers };
        break;
      case "class":
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: classTeachers, grades: classGrades };
        break;
      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: teacherSubjects };
        break;
      case "student":
        const studentGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        relatedData = { classes: studentClasses, grades: studentGrades };
        break;
      case "exam":
        console.log("Fetching lessons for exam form...");
        console.log("Role:", role, "Current User ID:", currentUserId);

        let examLessonsQuery = {};

        // Only filter by teacher if the role is explicitly "teacher" and we have a valid currentUserId
        if (role === "teacher" && currentUserId) {
          examLessonsQuery = { teacherId: currentUserId };
          console.log("Filtering lessons for teacher:", currentUserId);
        } else {
          console.log(
            "Showing all lessons (admin/student/parent view or no specific teacher)"
          );
        }

        console.log("Lesson query where clause:", examLessonsQuery);

        try {
          const examLessons = await prisma.lesson.findMany({
            where: examLessonsQuery,
            select: {
              id: true,
              name: true,
              subject: { select: { name: true } },
              class: { select: { name: true } },
            },
            orderBy: { id: "asc" }, // Add consistent ordering
          });

          console.log("Raw lessons found:", examLessons.length);
          if (examLessons.length === 0) {
            console.warn(
              "No lessons found! This might indicate an issue with:",
              {
                role,
                currentUserId,
                queryUsed: examLessonsQuery,
              }
            );
          }

          // Create more descriptive lesson names
          const formattedLessons = examLessons.map((lesson) => ({
            id: lesson.id,
            name: `${lesson.name} - ${lesson.subject.name} (${lesson.class.name})`,
          }));

          console.log(
            "Formatted lessons being passed to form:",
            formattedLessons.length
          );
          relatedData = { lessons: formattedLessons };
        } catch (error) {
          console.error("Error fetching lessons:", error);
          // Fallback to empty array to prevent crashes
          relatedData = { lessons: [] };
        }
        break;
      case "assignment":
        console.log("Fetching lessons for assignment form...");
        console.log("Role:", role, "Current User ID:", currentUserId);

        let assignmentLessonsQuery = {};

        // Only filter by teacher if the role is explicitly "teacher" and we have a valid currentUserId
        if (role === "teacher" && currentUserId) {
          assignmentLessonsQuery = { teacherId: currentUserId };
          console.log("Filtering lessons for teacher:", currentUserId);
        } else {
          console.log(
            "Showing all lessons (admin/student/parent view or no specific teacher)"
          );
        }

        console.log(
          "Assignment lesson query where clause:",
          assignmentLessonsQuery
        );

        try {
          const assignmentLessons = await prisma.lesson.findMany({
            where: assignmentLessonsQuery,
            select: {
              id: true,
              name: true,
              subject: { select: { name: true } },
              class: { select: { name: true } },
            },
            orderBy: { id: "asc" }, // Add consistent ordering
          });

          console.log(
            "Raw assignment lessons found:",
            assignmentLessons.length
          );

          // If no lessons found and we're filtering by teacher, try getting all lessons as fallback
          let finalLessons = assignmentLessons;
          if (assignmentLessons.length === 0 && role === "teacher") {
            console.warn(
              `No lessons found for teacher ${currentUserId}! This teacher may not be assigned to any lessons.`
            );
            console.log("Available teacher IDs with lessons:");

            // Don't show all lessons as fallback for teachers - they should only see their own lessons
            console.log(
              "For security, teachers can only create assignments for their own lessons."
            );
            finalLessons = []; // Keep it empty rather than showing all lessons
          }

          if (finalLessons.length === 0) {
            console.warn("No lessons available for assignment creation:", {
              role,
              currentUserId,
              queryUsed: assignmentLessonsQuery,
              message:
                role === "teacher"
                  ? "This teacher is not assigned to any lessons"
                  : "No lessons found in database",
            });
          }

          // Create more descriptive lesson names
          const formattedAssignmentLessons = finalLessons.map((lesson) => ({
            id: lesson.id,
            name: `${lesson.name} - ${lesson.subject.name} (${lesson.class.name})`,
          }));

          console.log(
            "Formatted assignment lessons being passed to form:",
            formattedAssignmentLessons.length
          );
          console.log(
            "First few assignment lessons:",
            formattedAssignmentLessons.slice(0, 3)
          );
          relatedData = { lessons: formattedAssignmentLessons };
        } catch (error) {
          console.error("Error fetching assignment lessons:", error);
          // Fallback to empty array to prevent crashes
          relatedData = { lessons: [] };
        }
        break;
      case "result":
        console.log("Fetching related data for result form...");
        console.log("Role:", role, "Current User ID:", currentUserId);

        try {
          // Fetch exams based on role
          let examsQuery = {};
          if (role === "teacher" && currentUserId) {
            examsQuery = { lesson: { teacherId: currentUserId } };
            console.log("Filtering exams for teacher:", currentUserId);
          } else {
            console.log("Showing all exams (admin/student/parent view)");
          }

          const exams = await prisma.exam.findMany({
            where: examsQuery,
            select: {
              id: true,
              title: true,
              lesson: {
                select: {
                  name: true,
                  subject: { select: { name: true } },
                  class: { select: { name: true } },
                },
              },
            },
            orderBy: { id: "asc" },
          });

          console.log("Raw exams found:", exams.length);

          // Format exams with descriptive names
          const formattedExams = exams.map((exam) => ({
            id: exam.id,
            title: exam.title,
            lesson: `${exam.lesson.name} - ${exam.lesson.subject.name} (${exam.lesson.class.name})`,
          }));

          // Fetch assignments based on role
          let assignmentsQuery = {};
          if (role === "teacher" && currentUserId) {
            assignmentsQuery = { lesson: { teacherId: currentUserId } };
            console.log("Filtering assignments for teacher:", currentUserId);
          } else {
            console.log("Showing all assignments (admin/student/parent view)");
          }

          const assignments = await prisma.assignment.findMany({
            where: assignmentsQuery,
            select: {
              id: true,
              title: true,
              lesson: {
                select: {
                  name: true,
                  subject: { select: { name: true } },
                  class: { select: { name: true } },
                },
              },
            },
            orderBy: { id: "asc" },
          });

          console.log("Raw assignments found:", assignments.length);

          // Format assignments with descriptive names
          const formattedAssignments = assignments.map((assignment) => ({
            id: assignment.id,
            title: assignment.title,
            lesson: `${assignment.lesson.name} - ${assignment.lesson.subject.name} (${assignment.lesson.class.name})`,
          }));

          // Fetch students based on role
          let studentsQuery = {};
          if (role === "teacher" && currentUserId) {
            // Teachers can only create results for students in their classes
            studentsQuery = {
              class: {
                lessons: {
                  some: {
                    teacherId: currentUserId,
                  },
                },
              },
            };
            console.log("Filtering students for teacher:", currentUserId);
          } else {
            console.log("Showing all students (admin view)");
          }

          const students = await prisma.student.findMany({
            where: studentsQuery,
            select: {
              id: true,
              name: true,
              surname: true,
              class: { select: { name: true } },
            },
            orderBy: [{ name: "asc" }, { surname: "asc" }],
          });

          console.log("Raw students found:", students.length);

          console.log("Result form related data:", {
            exams: formattedExams.length,
            assignments: formattedAssignments.length,
            students: students.length,
          });

          relatedData = {
            exams: formattedExams,
            assignments: formattedAssignments,
            students: students,
          };
        } catch (error) {
          console.error("Error fetching result related data:", error);
          // Fallback to empty arrays to prevent crashes
          relatedData = {
            exams: [],
            assignments: [],
            students: [],
          };
        }
        break;

      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
