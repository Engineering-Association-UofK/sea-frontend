import React, { useState, useEffect } from "react";
import { AtSign, CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import {
  useUpdateUsername,
  useCheckUsername,
  useUpdateEmail,
} from "@/features/profile/hooks/useProfile";
import { UserProfileResponse } from "@/features/profile/api/models";
import { useLanguage } from "@/context/LanguageContext";

interface UsernameUpdatePanelProps {
  profile: UserProfileResponse;
}

export function UsernameUpdatePanel({ profile }: UsernameUpdatePanelProps) {
  const { translations } = useLanguage();
  const t = translations.profile.login;

  const [username, setUsername] = useState(profile.username);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [email, setEmail] = useState(profile.email);

  const updateUsernameMutation = useUpdateUsername();
  const checkUsernameMutation = useCheckUsername();
  const updateEmailMutation = useUpdateEmail();

  const isChanged = username.trim() !== "" && username !== profile.username;

  // Debounced availability check
  useEffect(() => {
    if (!isChanged) {
      setIsAvailable(null);
      return;
    }

    const timer = setTimeout(() => {
      checkUsernameMutation.mutate(
        { username: username.trim() },
        {
          onSuccess: (res) => {
            setIsAvailable(res.available);
          },
          onError: () => {
            setIsAvailable(false);
          },
        }
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [username, profile.username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChanged || isAvailable !== true) return;

    updateUsernameMutation.mutate({ username: username.trim() });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email !== profile.email) {
      updateEmailMutation.mutate({ email: email.trim() });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Username Update Card */}
      <div className="max-w-2xl rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <AtSign className="h-5 w-5 text-gray-500" /> {t.updateUsername}
        </h2>
        <p className="mb-6 text-xs text-gray-500">{t.usernameDesc}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700">
              {t.username}
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-400">
                @
              </span>
              <input
                type="text"
                dir="ltr"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))
                }
                className="w-full rounded-md border border-gray-300 pl-7 pr-10 py-2 text-sm focus:border-[var(--primary-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20"
                placeholder="new_username"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {checkUsernameMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                )}
                {!checkUsernameMutation.isPending &&
                  isChanged &&
                  isAvailable === true && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                {!checkUsernameMutation.isPending &&
                  isChanged &&
                  isAvailable === false && (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
              </div>
            </div>

            {/* Availability Status Messages */}
            {isChanged && (
              <div className="mt-2 text-xs">
                {checkUsernameMutation.isPending && (
                  <span className="text-gray-500">{t.checking}</span>
                )}
                {!checkUsernameMutation.isPending && isAvailable === true && (
                  <span className="font-medium text-green-600">
                    @{username} {t.available}
                  </span>
                )}
                {!checkUsernameMutation.isPending && isAvailable === false && (
                  <span className="font-medium text-red-600">
                    @{username} {t.taken}
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={
              !isChanged ||
              isAvailable !== true ||
              checkUsernameMutation.isPending ||
              updateUsernameMutation.isPending
            }
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
            style={
              isChanged &&
              isAvailable === true &&
              !updateUsernameMutation.isPending
                ? { backgroundColor: "var(--primary-color)" }
                : {}
            }
          >
            {updateUsernameMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {t.updateUsernameBtn}
          </button>
        </form>
      </div>

      {/* Email Update Card */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Mail className="h-5 w-5 text-gray-500" /> {t.updateEmail}
        </h2>
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700">
              {t.email}
            </label>
            <input
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-[var(--primary-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20"
            />
          </div>
          <button
            type="submit"
            disabled={
              updateEmailMutation.isPending ||
              !email.trim() ||
              email === profile.email
            }
            className="w-full rounded-md bg-gray-900 py-2 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {updateEmailMutation.isPending ? (
              <Loader2 className="mx-auto h-4 w-4 animate-spin" />
            ) : (
              t.updateEmailBtn
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
