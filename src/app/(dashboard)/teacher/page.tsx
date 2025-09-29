import StudentSettingsForm from "@/components/forms/StudentSettingsForm";

const StudentSettingsPage = () => {
  // Static student data
  const student = {
    id: "student-001",
    name: "John",
    surname: "Doe",
    email: "johndoe@example.com",
    phone: "08012345678",
    bloodType: "A",
    birthday: new Date("2007-05-14"),
    img: "/noAvatar.png",
    classId: "class-001",
  };

  return (
    <div className="p-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <StudentSettingsForm data={student} />
      </div>
    </div>
  );
};

export default StudentSettingsPage;
