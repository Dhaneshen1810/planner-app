"use client";
import useTasks from "@/hooks/use-tasks";
import DaySelectionContainer from "./day-selection/day-selection-container";
import TaskCard from "./task-card";
import Footer from "../footer-box/footer";

const TaskContainer = () => {
  const { tasks } = useTasks();

  return (
    <div className="flex flex-col bg-white border-t border-gray-200 rounded-t-2xl p-4 w-full">
      <DaySelectionContainer />
      <div className="flex flex-col items-center py-3">
        {tasks.length > 0 ? (
          <div className="flex flex-col w-full">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-2xl">There are no tasks for today</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TaskContainer;
