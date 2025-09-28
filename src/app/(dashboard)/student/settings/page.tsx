import StudentSettingsForm from "@/components/forms/StudentSettingsForm";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const StudentSettingsPage = async () => {
  const { userId } = auth();

  const student = await prisma.student.findUnique({
    where: {
      id: userId!,
    },
  });

  if (!student) {
    return (
      <div className="p-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-xl font-semibold mb-4">Student Not Found</h1>
          <p>Could not find student data. Please contact your administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <StudentSettingsForm data={student} />
      </div>
    </div>
  );
};

export default StudentSettingsPage;