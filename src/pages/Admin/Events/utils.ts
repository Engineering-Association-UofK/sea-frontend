import { AxiosError } from "axios";
import { Secretariat } from "@/features/events/api/models";

export const SECRETARIAT_LABELS: Record<Secretariat, string> = {
  [Secretariat.Media]: "Media",
  [Secretariat.Academic]: "Academic",
  [Secretariat.Sports]: "Sports",
  [Secretariat.ExRelations]: "External Relations",
  [Secretariat.Cultural]: "Cultural",
  [Secretariat.Financial]: "Financial",
  [Secretariat.General]: "General",
  [Secretariat.Social]: "Social",
};

export const SECRETARIAT_OPTIONS = Object.values(Secretariat).map((value) => ({
  value,
  label: SECRETARIAT_LABELS[value],
}));

/** ISO string -> value for <input type="datetime-local"> (local time). */
export function isoToInputValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

/** <input type="datetime-local"> value -> ISO. */
export function inputValueToIso(value: string): string {
  return new Date(value).toISOString();
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Pulls a readable message out of an axios error, falling back to a default. */
export function getErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<{ message?: string; error?: string }>;
  return (
    axiosError?.response?.data?.message ||
    axiosError?.response?.data?.error ||
    fallback
  );
}
