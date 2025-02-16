import UpdateTaskForm from "@/components/forms/update-task-form";
import { Task } from "@/src/types";

const UpdateTask = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const response = await fetch(`${process.env.SERVER_URL}/tasks/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return <p>Could not find task information</p>;
  }

  const task = (await response.json()) as Task;
  console.log({ task });

  return (
    <div className="flex min-h-screen bg-primary items-center flex-col pt-2 gap-5 w-full">
      <p className="text-2xl font-bold">Update Task</p>
      <UpdateTaskForm task={task} />
    </div>
  );
};

export default UpdateTask;
