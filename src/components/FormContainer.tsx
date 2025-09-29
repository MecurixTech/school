import FormModal from "./FormModal";

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
    | "announcement"
    | "message";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
  relatedData?: any;
};

const FormContainer = ({ table, type, data, id }: FormContainerProps) => {
  let relatedData: any = {};

  if (type !== "delete") {
    switch (table) {
      case "subject":
        relatedData = {
          teachers: [
            { id: "t1", name: "John", surname: "Doe" },
            { id: "t2", name: "Jane", surname: "Smith" },
          ],
        };
        break;
      case "class":
        relatedData = {
          grades: [
            { id: "g1", level: "Grade 1" },
            { id: "g2", level: "Grade 2" },
          ],
          teachers: [
            { id: "t1", name: "John", surname: "Doe" },
            { id: "t2", name: "Jane", surname: "Smith" },
          ],
        };
        break;
      case "teacher":
        relatedData = {
          subjects: [
            { id: "s1", name: "Math" },
            { id: "s2", name: "Science" },
          ],
        };
        break;
      case "student":
        relatedData = {
          grades: [
            { id: "g1", level: "Grade 1" },
            { id: "g2", level: "Grade 2" },
          ],
          classes: [
            { id: "c1", name: "Class A" },
            { id: "c2", name: "Class B" },
          ],
          parents: [
            { id: "p1", name: "Alice", surname: "Johnson", email: "alice@example.com" },
            { id: "p2", name: "Bob", surname: "Williams", email: "bob@example.com" },
          ],
        };
        break;
      case "exam":
      case "assignment":
        relatedData = {
          lessons: [
            { id: "l1", name: "Algebra - Math (Class A)" },
            { id: "l2", name: "Biology - Science (Class B)" },
          ],
        };
        break;
      case "result":
        relatedData = {
          exams: [
            { id: "e1", title: "Midterm Exam", lesson: "Algebra - Math (Class A)" },
          ],
          assignments: [
            { id: "a1", title: "Homework 1", lesson: "Algebra - Math (Class A)" },
          ],
          students: [
            { id: "s1", name: "Sam", surname: "Taylor", class: { name: "Class A" } },
          ],
        };
        break;
      case "attendance":
        relatedData = {
          lessons: [
            { id: "l1", name: "Algebra - Math (Class A)", classId: "c1" },
            { id: "l2", name: "Biology - Science (Class B)", classId: "c2" },
          ],
          students: [
            { id: "s1", name: "Sam", surname: "Taylor", classId: "c1", class: { name: "Class A" } },
            { id: "s2", name: "Lily", surname: "Brown", classId: "c2", class: { name: "Class B" } },
          ],
        };
        break;
      case "event":
        relatedData = {
          classes: [
            { id: "c1", name: "Class A" },
            { id: "c2", name: "Class B" },
          ],
        };
        break;
      case "lesson":
        relatedData = {
          subjects: [
            { id: "s1", name: "Math" },
            { id: "s2", name: "Science" },
          ],
          classes: [
            { id: "c1", name: "Class A" },
            { id: "c2", name: "Class B" },
          ],
        };
        break;
      default:
        relatedData = {};
        break;
    }
  }

  return (
    <div className="form-container">
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
