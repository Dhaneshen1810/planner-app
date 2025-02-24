import TaskManager from "@/components/TaskManager";
import { Task } from "@/src/types";
import axios from "axios";
export const dynamic = "force-dynamic";
import { toZonedTime, format } from "date-fns-tz";

const fetchTasks = async (): Promise<Task[]> => {
  const SERVER_URL = process.env.SERVER_URL || "http://localhost:4000";

  const edmontonTimeZone = "America/Edmonton";
  const now = new Date();
  const edmontonDate = toZonedTime(now, edmontonTimeZone);
  const localDate = format(edmontonDate, "yyyy-MM-dd", {
    timeZone: edmontonTimeZone,
  });

  try {
    const response = await axios.get<Task[]>(
      `${SERVER_URL}/tasks?date=${localDate}`,
      {
        timeout: 30000, // 30 seconds timeout
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

const TasksPage = async () => {
  const tasks = await fetchTasks();
  const sortedTasks = tasks.sort((a, b) => a.position - b.position);

  return (
    <div className="flex h-screen bg-lightPink justify-center">
      <TaskManager tasks={sortedTasks} />
    </div>
  );
};

export default TasksPage;
