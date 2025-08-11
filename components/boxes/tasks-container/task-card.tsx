"use client";

import { useRef } from "react";
import { Task } from "@/src/stores/tasksStore";
import EditTaskModal from "@/components/modals/edit-task-modal";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
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
        <p className="text-gray-500 text-xl">{task.title}</p>
      </div>

      {/* Hidden trigger for modal */}
      <EditTaskModal ref={modalRef} task={task} />
    </>
  );
};

export default TaskCard;
