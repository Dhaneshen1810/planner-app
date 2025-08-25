"use client";

import React, { useState, useEffect } from "react";
import { CalculatorIcon, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useTasks from "@/hooks/use-tasks";
import { getLocalDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

const CalendarPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { tasks, getAllTasks } = useTasks();
  const [localTasks, setLocalTasks] = useState(tasks ?? []);

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

  const handleToggle = async () => {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen) {
      await loadTasks();
    }
  };

  const today = getLocalDate();

  return (
    <div className="flex flex-col min-h-screen max-w-md w-full mx-auto bg-black text-white">
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur px-4 py-3 border-b border-neutral-800">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="bg-white text-black h-9 px-3 rounded-lg"
            title="Back to Tasks"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <h1 className="text-lg font-semibold tracking-tight text-center">Calendar</h1>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleToggle}
              aria-pressed={open}
              title="Show/Hide all tasks"
              className={`h-9 px-3 rounded-lg bg-white text-black ${
                open ? "ring-1 ring-black/40" : ""
              }`}
            >
              <Calendar className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              onClick={loadTasks}
              className="h-9 px-3 rounded-lg bg-white text-black font-medium"
              title="Refresh Tasks"
            >
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="px-4 pt-4">
        <p className="text-sm text-neutral-300">{today}</p>
      </div>

      <main className="mt-3 bg-white text-neutral-900 rounded-t-2xl border-t border-neutral-200 p-4 flex-1">
        {!open && (
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-600">
            Click the calendar button to show all tasks.
          </div>
        )}

        {open && (
          <>
            {loading && (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4"
                  >
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
                    <Card
                      className={
                        task.is_completed
                          ? "bg-neutral-100 border-neutral-200"
                          : "bg-lavender border-lavender"
                      }
                    >
                      <CardContent className="flex justify-between items-center py-3 px-4">
                        <div className="flex flex-col">
                          <span
                            className={
                              task.is_completed
                                ? "line-through text-neutral-600"
                                : "font-semibold text-neutral-900"
                            }
                          >
                            {task.title}
                          </span>
                          <span className="text-xs text-neutral-700/80">
                            {task.date || "Anytime"}
                            {task.time ? ` • ${task.time}` : ""}
                          </span>
                        </div>

                        <div className="text-xs text-neutral-800/80">
                          {task.is_completed ? "Completed" : ""}
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>

      <footer className="px-4 py-3 text-xs text-neutral-400 text-center">
        Tip: Toggle the calendar with the calendar button. The + button on the
        main screen opens the Create Task modal.
      </footer>
    </div>
  );
};

export default CalendarPage;
