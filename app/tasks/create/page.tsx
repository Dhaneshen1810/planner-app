import AddTaskForm from "@/components/forms/add-task-form";

const NewTask = () => {
  return (
    <div className="flex min-h-screen bg-lightPink items-center flex-col pt-2 gap-5 w-full">
      <p className="text-2xl font-bold text-white">Create Task</p>
      <AddTaskForm />
    </div>
  );
};

export default NewTask;
