import TaskManager from "@/components/TaskManager";
import { getLocalDate } from "@/lib/utils";
import { Task } from "@/src/types";
import axios from "axios";
export const dynamic = "force-dynamic";

const fetchTasks = async (): Promise<Task[]> => {
  const SERVER_URL = process.env.SERVER_URL || "http://localhost:4000";

  try {
    const localDate = getLocalDate();
    const response = await axios.get<Task[]>(
      `${SERVER_URL}/tasks?date=${localDate}`
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

  return <TaskManager tasks={sortedTasks} />;
};

export default TasksPage;
