import TaskManager from "@/components/TaskManager";
import { Task } from "@/src/types";
import axios from "axios";
export const dynamic = "force-dynamic";

const fetchTasks = async (): Promise<Task[]> => {
  const SERVER_URL = process.env.SERVER_URL || "http://localhost:4000";
  try {
    const response = await axios.get<Task[]>(`${SERVER_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

const TasksPage = async () => {
  const tasks = await fetchTasks();
  const sortedTasks = tasks.sort((a, b) => a.position - b.position);

  return <TaskManager tasks={sortedTasks} allTasks={true} />;
};

export default TasksPage;
