import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, forwardRef, useImperativeHandle } from "react";
import UpdateTaskForm from "../forms/update-task-form";
import { Task } from "@/src/stores/tasksStore";

export interface EditTaskModalHandle {
  openModal: () => void;
}

interface EditTaskModalProps {
  task: Task;
}

const EditTaskModal = forwardRef<EditTaskModalHandle, EditTaskModalProps>(
  ({ task }, ref) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      openModal: () => setOpen(true),
    }));

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[680px] max-w-[350px] px-1 sm:p-8 rounded-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="mb-2">
            <DialogTitle>Edit Task or Habit</DialogTitle>
          </DialogHeader>
          <div className="px-0 sm:px-1">
            <UpdateTaskForm onSuccess={() => setOpen(false)} task={task} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

EditTaskModal.displayName = "EditTaskModal";
export default EditTaskModal;
