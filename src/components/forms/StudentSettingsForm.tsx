"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  studentSettingsSchema,
  StudentSettingsSchema,
} from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { updateStudentSettings } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";

const StudentSettingsForm = ({
  data,
}: {
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSettingsSchema>({
    resolver: zodResolver(studentSettingsSchema),
  });

  const [img, setImg] = useState<any>();

  const [state, formAction] = useFormState(
    updateStudentSettings,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    formAction({ ...data, img: img?.secure_url });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Your settings have been updated!`);
      router.refresh();
    }
  }, [state, router]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Update Your Settings</h1>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <CldUploadWidget
        uploadPreset="school"
        onSuccess={(result, { widget }) => {
          setImg(result.info);
          widget.close();
        }}
      >
        {({ open }) => {
          return (
            <div
              className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
              onClick={() => open()}
            >
              <Image src={img?.secure_url || data?.img || "/noAvatar.png"} alt="" width={28} height={28} className="rounded-full" />
              <span>Upload a photo</span>
            </div>
          );
        }}
      </CldUploadWidget>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Birthday"
          name="birthday"
          defaultValue={data?.birthday.toISOString().split("T")[0]}
          register={register}
          error={errors.birthday}
          type="date"
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
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Emergency Contact
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Emergency Contact Name"
          name="emergencyContactName"
          defaultValue={data?.emergencyContactName}
          register={register}
          error={errors.emergencyContactName}
        />
        <InputField
          label="Emergency Contact Phone"
          name="emergencyContactPhone"
          defaultValue={data?.emergencyContactPhone}
          register={register}
          error={errors.emergencyContactPhone}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Preferences
      </span>
      <div className="flex justify-between flex-wrap gap-4">
      <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Language</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("language")}
            defaultValue={data?.language}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
          {errors.language?.message && (
            <p className="text-xs text-red-400">
              {errors.language.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Timezone</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("timezone")}
            defaultValue={data?.timezone}
          >
            <option value="UTC-5">Eastern Time (US & Canada)</option>
            <option value="UTC-6">Central Time (US & Canada)</option>
            <option value="UTC-7">Mountain Time (US & Canada)</option>
            <option value="UTC-8">Pacific Time (US & Canada)</option>
          </select>
          {errors.timezone?.message && (
            <p className="text-xs text-red-400">
              {errors.timezone.message.toString()}
            </p>
          )}
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Change Password
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Current Password"
          name="currentPassword"
          type="password"
          register={register}
          error={errors.currentPassword}
        />
        <InputField
          label="New Password"
          name="newPassword"
          type="password"
          register={register}
          error={errors.newPassword}
        />
        <InputField
          label="Confirm New Password"
          name="confirmNewPassword"
          type="password"
          register={register}
          error={errors.confirmNewPassword}
        />
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        Update Settings
      </button>
    </form>
  );
};

export default StudentSettingsForm;
