import { TaskFormValues } from "@/components/forms/add-task-form";
import { UpdateTaskFormValues } from "@/components/forms/update-task-form";
import { isActiveTask } from "@/lib/utils";
import { Task, useTaskStore } from "@/src/stores/tasksStore";
import axios from "axios";

const useTasks = () => {
  const { tasks, setTasks, activeDate, setActiveDate } = useTaskStore(
    (state) => state
  );

  const getTasks = async (dateStr: string): Promise<Task[]> => {
    try {
      const response = await axios.get(`/api/tasks?date=${dateStr}`);

      const tasks: Task[] = response.data.tasks;

      setTasks(tasks);
      return tasks;
    } catch (error) {
      console.error("[useResults] Failed to fetch results:", error);
      setTasks([]);

      return [];
    }
  };

  const createEntry = async (data: TaskFormValues) => {
    try {
      const response = await axios.post("/api/tasks", { data });

      if (response.data?.success) {
        const newTask: Task = response.data.task;

        if (isActiveTask(activeDate, newTask)) {
          setTasks([...(tasks || []), newTask]);
        }

        return newTask;
      } else {
        throw new Error(response.data?.message || "Failed to create task");
      }
    } catch (error) {
      console.error("[useResults] Failed to add result:", error);
      throw error;
    }
  };

  const updateEntry = async (id: string, data: UpdateTaskFormValues) => {
    try {
      const response = await axios.put(`/api/tasks/${id}`, { task: data });

      if (response.data?.success) {
        const updatedTask: Task = response.data.task;

        const updatedTasks = tasks.map((t) => (t.id === id ? updatedTask : t));

        setTasks(updatedTasks);

        return updatedTask;
      } else {
        throw new Error(response.data?.message || "Failed to create task");
      }
    } catch (error) {
      console.error("[useResults] Failed to add result:", error);
      throw error;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await axios.delete(`/api/tasks/${id}`);

      const updatedTasks = tasks.filter((task) => task.id !== id);

      setTasks(updatedTasks);
    } catch (error) {
      console.error("Failed to delete result:", error);
      throw error;
    }
  };

  return {
    tasks,
    getTasks,
    createEntry,
    updateEntry,
    deleteEntry,
    activeDate,
    setActiveDate,
  };
};

export default useTasks;
