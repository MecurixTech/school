"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { resultSchema, ResultSchema } from "@/lib/formValidationSchemas";
import { createResult, updateResult } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ResultForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    type === "create" ? createResult : updateResult,
    {
      success: false,
      error: false,
    }
  );

  // Watch the resultType to show/hide appropriate dropdowns
  const [resultType, setResultType] = useState<"exam" | "assignment">(
    data?.examId ? "exam" : data?.assignmentId ? "assignment" : "exam"
  );

  const onSubmit = handleSubmit((data) => {
    console.log("Result form data before submission:", data);

    // Clean up the data based on resultType
    const cleanedData = {
      ...data,
      examId: resultType === "exam" ? data.examId : undefined,
      assignmentId: resultType === "assignment" ? data.assignmentId : undefined,
    };

    console.log("Cleaned result data:", cleanedData);
    formAction(cleanedData);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Result has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { exams, assignments, students } = relatedData || {};

  console.log("Related data passed to ResultForm:", {
    exams: exams?.length,
    assignments: assignments?.length,
    students: students?.length,
  });

  // Ensure all arrays are defined
  const safeExams = Array.isArray(exams) ? exams : [];
  const safeAssignments = Array.isArray(assignments) ? assignments : [];
  const safeStudents = Array.isArray(students) ? students : [];

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new result" : "Update the result"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Score (0-100)"
          name="score"
          defaultValue={data?.score}
          register={register}
          error={errors?.score}
          type="number"
        />

        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}

        {/* Result Type Selection */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Result Type</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            value={resultType}
            onChange={(e) =>
              setResultType(e.target.value as "exam" | "assignment")
            }
          >
            <option value="exam">Exam Result</option>
            <option value="assignment">Assignment Result</option>
          </select>
        </div>

        {/* Exam Dropdown - only show if resultType is exam */}
        {resultType === "exam" && (
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Exam</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("examId")}
              defaultValue={data?.examId ? data.examId.toString() : ""}
            >
              <option value="">Select an exam</option>
              {safeExams.length > 0 ? (
                safeExams.map(
                  (exam: { id: number; title: string; lesson?: string }) => (
                    <option value={exam.id} key={exam.id}>
                      {exam.title}
                      {exam.lesson ? ` - ${exam.lesson}` : ""}
                    </option>
                  )
                )
              ) : (
                <option value="" disabled>
                  No exams available
                </option>
              )}
            </select>
            {errors.examId?.message && (
              <p className="text-xs text-red-400">
                {errors.examId.message.toString()}
              </p>
            )}
          </div>
        )}

        {/* Assignment Dropdown - only show if resultType is assignment */}
        {resultType === "assignment" && (
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Assignment</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("assignmentId")}
              defaultValue={
                data?.assignmentId ? data.assignmentId.toString() : ""
              }
            >
              <option value="">Select an assignment</option>
              {safeAssignments.length > 0 ? (
                safeAssignments.map(
                  (assignment: {
                    id: number;
                    title: string;
                    lesson?: string;
                  }) => (
                    <option value={assignment.id} key={assignment.id}>
                      {assignment.title}
                      {assignment.lesson ? ` - ${assignment.lesson}` : ""}
                    </option>
                  )
                )
              ) : (
                <option value="" disabled>
                  No assignments available
                </option>
              )}
            </select>
            {errors.assignmentId?.message && (
              <p className="text-xs text-red-400">
                {errors.assignmentId.message.toString()}
              </p>
            )}
          </div>
        )}

        {/* Student Dropdown */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Student</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("studentId")}
            defaultValue={data?.studentId || ""}
          >
            <option value="">Select a student</option>
            {safeStudents.length > 0 ? (
              safeStudents.map(
                (student: { id: string; name: string; surname: string }) => (
                  <option value={student.id} key={student.id}>
                    {student.name} {student.surname}
                  </option>
                )
              )
            ) : (
              <option value="" disabled>
                No students available
              </option>
            )}
          </select>
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">
              {errors.studentId.message.toString()}
            </p>
          )}
        </div>
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ResultForm;
