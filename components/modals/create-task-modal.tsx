import { Plus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddTaskForm from "../forms/add-task-form";
import { useState } from "react";

const AddTaskModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Create a task or habit"
          className="px-5 py-3 border border-gray-300 rounded-full shadow-md bg-white hover:shadow-lg transition-shadow"
        >
          <Plus
            className="h-8 w-8 text-gray-500"
            stroke="currentColor"
            strokeWidth={2.5}
          />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[680px] max-w-[350px] px-1 sm:p-8 rounded-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="mb-2">
          <DialogTitle>Create a new Task or Habit</DialogTitle>
        </DialogHeader>

        <div className="px-0 sm:px-1">
          <AddTaskForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
