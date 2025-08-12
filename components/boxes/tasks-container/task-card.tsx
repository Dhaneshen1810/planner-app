"use client";

import { useRef } from "react";
import { Task } from "@/src/stores/tasksStore";
import EditTaskModal from "@/components/modals/edit-task-modal";
import axios from "axios";
import useTasks from "@/hooks/use-tasks";

interface TaskCardProps {
  task: Task;
  isToday: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isToday }) => {
  const { updateTask } = useTasks();
  const modalRef = useRef<{ openModal: () => void } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressDelay = 500; // ms

  const startPress = () => {
    timerRef.current = setTimeout(() => {
      // Trigger modal open
      modalRef.current?.openModal();
    }, longPressDelay);
  };

  const endPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTaskClick = async (completed: boolean) => {
    if (!isToday) {
      return;
    }

    try {
      const payload = {
        title: task.title,
        date: task.date,
        time: task.time ?? "",
        is_completed: !completed,
        recurring_option: task.recurring_option ?? [],
        position: task.position ?? 0,
      };

      const res = await axios.put(
        `/api/tasks/${task.id}`,
        { task: payload },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data?.success) {
        updateTask(task.id, res.data.task);
      } else {
        console.error("Update failed:", res.data);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <>
      <div
        className="flex px-4 cursor-pointer select-none"
        onMouseDown={startPress}
        onMouseUp={endPress}
        onMouseLeave={endPress}
        onTouchStart={startPress}
        onTouchEnd={endPress}
      >
        <button
          className={`${
            isToday && !task.is_completed ? "text-black" : "text-gray-500"
          } text-xl ${task.is_completed && isToday ? "line-through" : ""}`}
          onClick={() => handleTaskClick(task.is_completed)}
        >
          {task.title}
        </button>
      </div>

      <EditTaskModal ref={modalRef} task={task} />
    </>
  );
};

export default TaskCard;
