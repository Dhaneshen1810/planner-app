"use client";

import { Task } from "@/src/types";
import dynamic from "next/dynamic";

// Dynamically import DraggableCardList with SSR disabled
const DraggableCardList = dynamic(
  () => import("@/components/draggable-card-list"),
  {
    ssr: false, // Disable server-side rendering
  }
);

interface TaskManagerProps {
  tasks: Task[];
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks }) => {
  return <DraggableCardList initialCards={tasks} />;
};

export default TaskManager;
