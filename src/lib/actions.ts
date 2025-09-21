"use server";

import { revalidatePath } from "next/cache";
import {
  ClassSchema,
  ExamSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
  ParentSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean };

function handleError(err: any, context: string = "") {
  console.error(`${context} error:`, err);

  if (err.code === "P2002") {
    return {
      success: false,
      error: true,
      message: `Duplicate entry on: ${err.meta?.target?.join(", ")}`,
    };
  }

  if (err.clerkError && err.errors?.length > 0) {
    return {
      success: false,
      error: true,
      message: err.errors[0].longMessage || err.errors[0].message,
    };
  }

  return {
    success: false,
    error: true,
    message: err.message || "Unexpected error occurred",
  };
}

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    return handleError(err, "CreateSubject");
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.update({
      where: { id: data.id },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    return handleError(err, "UpdateSubject");
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const id = data.get("id") as string;
    await prisma.subject.delete({ where: { id: parseInt(id) } });

    return { success: true, error: false };
  } catch (err: any) {
    return handleError(err, "DeleteSubject");
  }
};

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.create({ data });

    return { success: true, error: false };
  } catch (err: any) {
    return handleError(err, "CreateClass");
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.update({
      where: { id: data.id },
      data,
    });

    return { success: true, error: false };
  } catch (err: any) {
    return handleError(err, "UpdateClass");
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const id = data.get("id") as string;
    await prisma.class.delete({ where: { id: parseInt(id) } });

    return { success: true, error: false };
  } catch (err: any) {
    return handleError(err, "DeleteClass");
  }
};

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  let user;

  try {
    
    user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "teacher" },
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    
    if (user?.id) {
      try {
        await clerkClient.users.deleteUser(user.id);
        
      } catch (rollbackErr) {
        console.error("Failed to rollback Clerk user:", rollbackErr);
      }
    }

    return handleError(err, "CreateTeacher");
  }
};


export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) {
    return { success: false, error: true, message: "Teacher ID missing" };
  }

  try {
    await clerkClient.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.teacher.update({
      where: { id: data.id },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    return handleError(err, "UpdateTeacher");
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const id = data.get("id") as string;

    await clerkClient.users.deleteUser(id);
    await prisma.teacher.delete({ where: { id } });

    return { success: true, error: false };
  } catch (err: any) {
    return handleError(err, "DeleteTeacher");
  }
};

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  let user;

  try {
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return {
        success: false,
        error: true,
        message: "This class is already at full capacity.",
      };
    }

    user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "student" },
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    
    if (user?.id) {
      try {
        await clerkClient.users.deleteUser(user.id);
        
      } catch (rollbackErr) {
        console.error("Failed to rollback Clerk user:", rollbackErr);
      }
    }

    return handleError(err, "CreateStudent");
  }
};


export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!data.id) {
    return { success: false, error: true, message: "Student ID missing" };
  }

  try {
    await clerkClient.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.student.update({
      where: { id: data.id },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    return handleError(err, "UpdateStudent");
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const id = data.get("id") as string;

    await clerkClient.users.deleteUser(id);
    await prisma.student.delete({ where: { id } });

    return { success: true, error: false };
  } catch (err: any) {
    return handleError(err, "DeleteStudent");
  }
};

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  try {
    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    return handleError(err, "CreateExam");
  }
};

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  try {
    await prisma.exam.update({
      where: { id: data.id },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    return handleError(err, "UpdateExam");
  }
};

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const id = data.get("id") as string;

    await prisma.exam.delete({ where: { id: parseInt(id) } });

    return { success: true, error: false };
  } catch (err: any) {
    return handleError(err, "DeleteExam");
  }
};


export const createParent = async (data: any) => {
  let user;

  try {
  
    user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      emailAddress: data.email ? [data.email] : undefined,
      publicMetadata: { role: "parent" },
    });

    await prisma.parent.create({
      data: {
        id: user.id, 
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    
    if (user?.id) {
      try {
        await clerkClient.users.deleteUser(user.id);
      } catch (rollbackErr) {
        console.error("Failed to rollback Clerk user:", rollbackErr);
      }
    }
    return handleError(err, "CreateParent");
  }
};


export const updateParent = async (data: any) => {
  try {
    
    await clerkClient.users.updateUser(data.id, {
      username: data.username,
      password: data.password || undefined, 
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.parent.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    return handleError(err, "UpdateParent");
  }
};


export const deleteParent = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const id = data.get("id") as string;
    await prisma.parent.delete({ where: { id: String(id) }, });
    return { success: true, error: false };
  } catch (err: any) {
    return handleError(err, "DeleteParent");
  }
};
