import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddTaskForm, { TaskFormValues } from "../forms/add-task-form";
import axios from "axios";
import { Task } from "@/src/types";
import { isSuccessfullResponse } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (task: Task) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();

  const handleSubmit = async (data: TaskFormValues, selectedDays: string[]) => {
    await axios
      .post("/api/tasks", {
        title: data.title,
        selectedDays,
      })
      .then((response) => {
        if (isSuccessfullResponse(response.status)) {
          const createdTask: Task = response.data.task;
          onSuccess(createdTask);
          onClose();
        }
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Failed to add task",
          description: "An unexpected error occurred",
        });
        console.error("Error adding task:", error);
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-secondary border-secondary top-10 sm:top-20 translate-y-0">
        <DialogHeader>
          <DialogTitle>Add new Task</DialogTitle>
        </DialogHeader>
        <AddTaskForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
