export enum RECURRING_OPTION {
  MONDAY = "Monday",
  TUESDAY = "Tuesday",
  WEDNESDAY = "Wednesday",
  THURSDAY = "Thursday",
  FRIDAY = "Friday",
  SATURDAY = "Saturday",
  SUNDAY = "Sunday",
  NONE = "None",
}

export interface Task {
  id: string;
  title: string;
  date?: Date;
  time?: string;
  recurring_option: RECURRING_OPTION[];
  is_completed: boolean;
  position: number;
}

export interface CreateTaskInput extends Omit<Task, "id" | "date"> {
  date: string;
}

export interface UpdateTaskInput extends Omit<Task, "id" | "date"> {
  date: string;
}
