import React from "react";
import UpdateTaskForm from "@/components/forms/update-task-form";
import { Task } from "@/src/types";

export default async function UpdateTask({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await fetch(`${process.env.SERVER_URL}/tasks/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return <p>Could not find task information</p>;
  }

  const task = (await response.json()) as Task;

  return (
    <div className="flex min-h-screen bg-lightPink items-center flex-col pt-2 gap-5 w-full">
      <p className="text-2xl font-bold text-white">Modify Task</p>
      <UpdateTaskForm task={task} />
    </div>
  );
}
