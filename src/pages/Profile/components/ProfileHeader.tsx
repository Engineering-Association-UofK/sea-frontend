import React from "react";
import { Upload } from "lucide-react";
import { useUpdatePicture } from "@/features/profile/hooks/useProfile";
import { UserProfileResponse } from "@/features/profile/api/models";

interface ProfileHeaderProps {
  profile: UserProfileResponse;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const updatePictureMutation = useUpdatePicture();

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updatePictureMutation.mutate(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
      <div className="relative shrink-0">
        <img
          src={profile.profile_pic}
          alt="Profile Avatar"
          className="h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32 ring-4"
          style={{
            boxShadow: "0 0 0 4px rgba(var(--primary-color), 0.1)",
          }}
        />
        <label
          className="absolute bottom-1 right-1 flex h-6 w-6 p-1 cursor-pointer items-center justify-center rounded-lg text-white shadow-md ring-2 ring-white transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <Upload className="h-4 w-4 shrink-0" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePictureChange}
            disabled={updatePictureMutation.isPending}
          />
        </label>
      </div>

      <div className="min-w-0 flex-1 text-center sm:text-left">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <h1 className="break-words text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
            {profile.name_en}
          </h1>
          <span
            dir="rtl"
            className="break-words text-base font-medium text-gray-500 sm:text-lg"
          >
            {profile.name_ar}
          </span>
          <p className="mt-2 text-sm text-gray-500 break-all">
            @{profile.username} • {profile.email}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold capitalize"
            style={{
              backgroundColor: "rgba(var(--primary-color), 0.1)",
              color: "var(--primary-color)",
            }}
          >
            {profile.department} Dept.
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            ID: {profile.uni_id}
          </span>
        </div>
      </div>
    </div>
  );
}
