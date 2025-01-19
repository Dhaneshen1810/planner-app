import TaskManager from "@/components/TaskManager";
import { Task } from "@/src/types";
import axios from "axios";

const fetchTasks = async (): Promise<Task[]> => {
  const SERVER_URL = process.env.SERVER_URL || "http://localhost:4000";
  try {
    const response = await axios.get<Task[]>(`${SERVER_URL}/tasks`);
    console.log({ response });
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

const TasksPage = async () => {
  const tasks = await fetchTasks();

  return (
    <div className="flex h-screen bg-primary justify-center">
      <TaskManager tasks={tasks} />
    </div>
  );
};

export default TasksPage;
