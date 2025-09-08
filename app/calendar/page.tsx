"use client";

import React, { useState, useEffect, useRef } from "react";
import useTasks from "@/hooks/use-tasks";
import { getLocalDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import TaskCard from "@/components/boxes/tasks-container/task-card";

const CalendarPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {tasks, getAllTasks, activeDate} = useTasks();
  const [localTasks, setLocalTasks] = useState(tasks ?? []);
  const isToday = activeDate === getLocalDate();

  useEffect(() => {
    setLocalTasks(tasks ?? []);
  }, [tasks]);

  const loadTasks = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await getAllTasks();
      setLocalTasks(result ?? []);
    } catch (error) {
      console.error("Failed to load tasks: ", error);
      setError("Failed to load tasks. Try again.");
      setLocalTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const today = getLocalDate();

  return (
    <div className="flex flex-col min-h-screen max-w-md w-full mx-auto bg-black text-white">
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur px-4 py-3 border-b border-neutral-800">
        <div className="relative flex items-center justify-center">
          <h1 className="text-lg font-semibold tracking-tight text-center">Calendar</h1>
        </div>
      </header>

      <div className="px-4 pt-4">
        <p className="text-sm text-center text-neutral-300">{today}</p>
      </div>

      <main className="mt-3 bg-white text-neutral-900 rounded-t-2xl border-t border-neutral-200 p-4 flex-1">
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <Skeleton className="h-8 w-3/4 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="py-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && localTasks.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-neutral-400 text-lg">No tasks found</p>
            <p className="text-sm text-neutral-400 mt-2">
              Add tasks using the + button on the main screen.
            </p>
          </div>
        )}

        {!loading && !error && localTasks.length > 0 && (
          <ul className="space-y-3">
            {localTasks.map((task) => (
              <li key={task.id}>
                <TaskCard key={task.id} task={task} isToday={isToday} />
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="px-4 py-3 text-xs text-neutral-400 text-center">
        Task Planner App
      </footer>
    </div>
  );
};

export default CalendarPage;

