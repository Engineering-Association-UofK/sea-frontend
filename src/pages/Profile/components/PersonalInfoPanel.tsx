import React, { useState } from "react";
import { Key, Loader2 } from "lucide-react";
import {
  useUpdateProfile,
  useUpdatePassword,
} from "@/features/profile/hooks/useProfile";
import {
  Department,
  Gender,
  UserProfileResponse,
} from "@/features/profile/api/models";
import { useLanguage } from "@/context/LanguageContext";

interface PersonalInfoPanelProps {
  profile: UserProfileResponse;
}

export function PersonalInfoPanel({ profile }: PersonalInfoPanelProps) {
  const { translations } = useLanguage();
  const t = translations.profile.info;

  const updateProfileMutation = useUpdateProfile();
  const updatePasswordMutation = useUpdatePassword();

  const [formData, setFormData] = useState({
    id: profile.id,
    uni_id: profile.uni_id,
    name_ar: profile.name_ar,
    name_en: profile.name_en,
    phone: profile.phone,
    department: profile.department as Department,
    gender: profile.gender as Gender,
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePasswordMutation.mutate(passwordData, {
      onSuccess: () => {
        setPasswordData({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
      },
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{t.title}</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-700">
                {t.nameEn}
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) =>
                  setFormData({ ...formData, name_en: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-[var(--primary-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                {t.nameAr}
              </label>
              <input
                type="text"
                dir="rtl"
                value={formData.name_ar}
                onChange={(e) =>
                  setFormData({ ...formData, name_ar: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-[var(--primary-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-700">
                {t.phone}
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-[var(--primary-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                {t.department}
              </label>
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    department: e.target.value as Department,
                  })
                }
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-[var(--primary-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20"
              >
                {Object.values(Department).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept.charAt(0).toUpperCase() + dept.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            {updateProfileMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {updateProfileMutation.isPending ? t.saving : t.saveBtn}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Key className="h-5 w-5 text-gray-500" /> {t.securityTitle}
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700">
              {t.oldPassword}
            </label>
            <input
              type="password"
              value={passwordData.old_password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  old_password: e.target.value,
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-[var(--primary-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">
              {t.newPassword}
            </label>
            <input
              type="password"
              value={passwordData.new_password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  new_password: e.target.value,
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-[var(--primary-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">
              {t.confirmPassword}
            </label>
            <input
              type="password"
              value={passwordData.confirm_password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirm_password: e.target.value,
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-[var(--primary-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20"
            />
          </div>
          <button
            type="submit"
            disabled={updatePasswordMutation.isPending}
            className="w-full rounded-md bg-gray-900 py-2 text-sm font-medium text-white hover:bg-black"
          >
            {updatePasswordMutation.isPending ? (
              <Loader2 className="mx-auto h-4 w-4 animate-spin" />
            ) : (
              t.updatePasswordBtn
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
