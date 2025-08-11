import { create } from "zustand";
import { RECURRING_OPTION } from "../types";
import { getLocalDate } from "@/lib/utils";

export interface Task {
  id: string;
  title: string;
  date: string;
  time: string;
  recurring_option: RECURRING_OPTION[];
  is_completed: boolean;
  position: number;
}

interface TaskState {
  tasks: Task[];
  activeDate: string;
  setActiveDate: (activeDate: string) => void;
  isSubscribed: boolean;
  setTasks: (task: Task[]) => void;
  todayDate: string;
}

export const useTaskStore = create<TaskState>()((set) => ({
  tasks: [],
  isSubscribed: true,
  setTasks: (tasks) => set({ tasks }),
  activeDate: getLocalDate(),
  setActiveDate: (activeDate) => set({ activeDate }),
  todayDate: getLocalDate(),
}));

export const useTask = () => useTaskStore((state) => state.tasks);
