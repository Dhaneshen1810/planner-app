import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UpdateTaskForm, { TaskFormValues } from "../forms/update-task-form";
import axios from "axios";
import { Task } from "@/src/types";
import { isSuccessfullResponse } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface UpdateTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: Task;
  onSuccess: (updatedTask: Task) => void;
}

const UpdateTaskModal: React.FC<UpdateTaskModalProps> = ({
  open,
  onClose,
  task,
  onSuccess,
}) => {
  const { toast } = useToast();

  const handleSubmit = async (data: TaskFormValues) => {
    await axios
      .put(`/api/tasks/${task.id}`, {
        task: data,
      })
      .then((response) => {
        if (isSuccessfullResponse(response.status)) {
          const updatedTask: Task = response.data.task;
          onSuccess(updatedTask);
          onClose();
        }
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Failed to update task",
          description: "An unexpected error occurred",
        });
        console.error("Error updating task:", error);
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-secondary border-secondary">
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
        </DialogHeader>
        <UpdateTaskForm onSubmit={handleSubmit} currentTask={task} />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTaskModal;
