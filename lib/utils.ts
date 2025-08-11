import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";
import { addDays, startOfWeek } from "date-fns";
import { Task } from "@/src/stores/tasksStore";
import { RECURRING_OPTION } from "@/src/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isSuccessfullResponse = (status: number) =>
  status === 200 || status === 201;

/** ---- TZ helpers (Edmonton) ---- */
const EDMONTON_TZ = "America/Edmonton";
const nowInEdmonton = () => toZonedTime(new Date(), EDMONTON_TZ);
const fmtYMD = (d: Date) => formatInTimeZone(d, EDMONTON_TZ, "yyyy-MM-dd");

/** Dates consistently in Edmonton time */
export const getLocalDate = () => fmtYMD(nowInEdmonton());

export const getTodayDate = () =>
  formatInTimeZone(nowInEdmonton(), EDMONTON_TZ, "EEEE, MMMM do");

export const getDayOfWeek = () =>
  formatInTimeZone(nowInEdmonton(), EDMONTON_TZ, "EEE");

export const getFormattedDate = () =>
  formatInTimeZone(nowInEdmonton(), EDMONTON_TZ, "MMMM dd");

export const getYear = () =>
  formatInTimeZone(nowInEdmonton(), EDMONTON_TZ, "yyyy");

export const getTimeOfDay = () => {
  const hour = Number(formatInTimeZone(nowInEdmonton(), EDMONTON_TZ, "H"));
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  return "evening";
};

export interface WeekDay {
  /** yyyy-MM-dd in Edmonton time */
  date: string;
  /** Short day name (Mon, Tue, …) in Edmonton time */
  day: string;
}

/** Week starting Monday, computed in Edmonton time */
export const getCurrentWeekDays = (): WeekDay[] => {
  const todayYEG = nowInEdmonton();
  const weekStart = startOfWeek(todayYEG, { weekStartsOn: 1 }); // Monday

  return Array.from({ length: 7 }).map((_, i) => {
    const d = addDays(weekStart, i);
    return {
      date: formatInTimeZone(d, EDMONTON_TZ, "yyyy-MM-dd"),
      day: formatInTimeZone(d, EDMONTON_TZ, "EEE"),
    };
  });
};

export const isActiveTask = (date: string, task: Task): boolean => {
  const day = formatInTimeZone(date, EDMONTON_TZ, "EEEE");

  console.log(task.date, date, task.recurring_option, day);

  return (
    task.date === date ||
    task.recurring_option.includes(day as RECURRING_OPTION)
  );
};
