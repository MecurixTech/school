"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { AttendanceSchema, attendanceSchema } from "@/lib/formValidationSchemas";
import { createAttendance, updateAttendance } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AttendanceForm = ({
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
    setValue,
    watch,
  } = useForm<AttendanceSchema>({
    resolver: zodResolver(attendanceSchema),
  });

  const { lessons, students } = relatedData || {};

  // Ensure arrays exist
  const safeLessons = Array.isArray(lessons) ? lessons : [];
  const safeStudents = Array.isArray(students) ? students : [];

  const [selectedLessonId, setSelectedLessonId] = useState(data?.lessonId || "");
  const [filteredStudents, setFilteredStudents] = useState(safeStudents || []);

  // Filter students based on selected lesson's class
  useEffect(() => {
    if (selectedLessonId && safeLessons && safeStudents) {
      const selectedLesson = safeLessons.find(
        (lesson: any) => lesson.id === parseInt(selectedLessonId)
      );
      
      if (selectedLesson) {
        const studentsInClass = safeStudents.filter(
          (student: any) => student.classId === selectedLesson.classId
        );
        setFilteredStudents(studentsInClass);
      } else {
        setFilteredStudents(safeStudents);
      }
    } else {
      setFilteredStudents(safeStudents || []);
    }
  }, [selectedLessonId, safeLessons, safeStudents]);

  const [state, formAction] = useFormState(
    type === "create" ? createAttendance : updateAttendance,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log("AttendanceForm data:", data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Attendance has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  console.log("AttendanceForm - Related data:", {
    hasRelatedData: !!relatedData,
    lessonsCount: safeLessons.length,
    studentsCount: safeStudents.length,
    lessons: safeLessons.slice(0, 2),
    students: safeStudents.slice(0, 2),
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new attendance record" : "Update attendance record"}
      </h1>

      {/* DEBUG INFO */}
      <div className="bg-yellow-50 p-3 rounded-md text-xs">
        <p><strong>Debug Info:</strong></p>
        <p>Lessons available: {safeLessons.length}</p>
        <p>Students available: {safeStudents.length}</p>
        <p>Filtered students: {filteredStudents.length}</p>
        <p>Selected lesson ID: {selectedLessonId || "None"}</p>
      </div>

      <div className="flex justify-between flex-wrap gap-4">
        {/* DATE */}
        <InputField
          label="Date"
          name="date"
          defaultValue={data?.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
          register={register}
          error={errors?.date}
          type="date"
        />

        {/* LESSON SELECTION */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Lesson</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lessonId")}
            defaultValue={data?.lessonId || ""}
            onChange={(e) => {
              setSelectedLessonId(e.target.value);
            }}
          >
            <option value="">Select a lesson</option>
            {safeLessons?.length === 0 && (
              <option value="" disabled>No lessons available</option>
            )}
            {safeLessons?.map((lesson: { id: number; name: string; subject: { name: string }; class: { name: string } }) => (
              <option value={lesson.id} key={lesson.id}>
                {lesson.name} ({lesson.subject.name} - {lesson.class.name})
              </option>
            ))}
          </select>
          {errors.lessonId?.message && (
            <p className="text-xs text-red-400">
              {errors.lessonId.message.toString()}
            </p>
          )}
        </div>

        {/* STUDENT SELECTION */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Student</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("studentId")}
            defaultValue={data?.studentId || ""}
          >
            <option value="">Select a student</option>
            {filteredStudents?.length === 0 && (
              <option value="" disabled>
                {selectedLessonId ? "No students in this lesson's class" : "No students available"}
              </option>
            )}
            {filteredStudents?.map((student: { id: string; name: string; surname: string; class: { name: string } }) => (
              <option value={student.id} key={student.id}>
                {student.name} {student.surname} ({student.class.name})
              </option>
            ))}
          </select>
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">
              {errors.studentId.message.toString()}
            </p>
          )}
        </div>

        {/* ATTENDANCE STATUS */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Attendance Status</label>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="true"
                {...register("present")}
                defaultChecked={data?.present === true}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
              />
              <span className="text-sm text-green-700 font-medium">Present</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="false"
                {...register("present")}
                defaultChecked={data?.present === false}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
              />
              <span className="text-sm text-red-700 font-medium">Absent</span>
            </label>
          </div>
          {errors.present?.message && (
            <p className="text-xs text-red-400">
              {errors.present.message.toString()}
            </p>
          )}
        </div>
      </div>

      {/* HELPFUL INFO */}
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Quick Tips:</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Select a lesson first to filter students by class</li>
          <li>• Date defaults to today but can be changed for past records</li>
          <li>• Use Present/Absent radio buttons to mark attendance</li>
          <li>• Only students from the selected lesson's class will appear</li>
        </ul>
      </div>

      {/* ERROR DISPLAY */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <p className="text-sm text-red-600">
            Something went wrong! Please try again.
          </p>
        </div>
      )}

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create Attendance" : "Update Attendance"}
      </button>
    </form>
  );
};

export default AttendanceForm;