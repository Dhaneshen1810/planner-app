import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toZonedTime, format } from "date-fns-tz";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isSuccessfullResponse = (status: number) =>
  status === 200 || status === 201;

export const getLocalDate = () => {
  const edmontonTimeZone = "America/Edmonton";
  const now = new Date();
  const edmontonDate = toZonedTime(now, edmontonTimeZone);
  const localDate = format(edmontonDate, "yyyy-MM-dd", {
    timeZone: edmontonTimeZone,
  });

  return localDate;
};
