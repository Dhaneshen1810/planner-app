import { TaskFormValues } from "@/components/forms/add-task-form";
import { UpdateTaskFormValues } from "@/components/forms/update-task-form";
import { getLocalDate, isActiveTask, isTodayTask } from "@/lib/utils";
import { Task, useTaskStore } from "@/src/stores/tasksStore";
import axios from "axios";

const useTasks = () => {
  const {
    tasks,
    setTasks,
    activeDate,
    setActiveDate,
    todayTasks,
    setTodayTasks,
  } = useTaskStore((state) => state);

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

  const getAllTasks = async (): Promise<Task[]> => {
    try {
      const response = await axios.get(`/api/tasks`); 
      // use function to call tasks when designing task page

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

        if (isTodayTask(newTask)) {
          setTodayTasks([...(todayTasks || []), newTask]);
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

        if (isTodayTask(updatedTask)) {
          const updatedTodayTasks = todayTasks.map((t) =>
            t.id === id ? updatedTask : t
          );
          setTodayTasks(updatedTodayTasks);
        }

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

      if (activeDate === getLocalDate()) {
        setTodayTasks(updatedTasks);
      }
    } catch (error) {
      console.error("Failed to delete result:", error);
      throw error;
    }
  };

  const updateTask = (taskId: string, task: Task) => {
    const updatedTasks = tasks.map((t) => (t.id === taskId ? task : t));

    setTasks(updatedTasks);

    if (activeDate === getLocalDate()) {
      setTodayTasks(updatedTasks);
    }
  };

  return {
    tasks,
    updateTask,
    getTasks,
    createEntry,
    updateEntry,
    deleteEntry,
    activeDate,
    setActiveDate,
    todayTasks,
    setTodayTasks,
  };
};

export default useTasks;
