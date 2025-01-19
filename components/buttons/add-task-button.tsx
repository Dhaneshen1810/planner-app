"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddTaskModal from "../modals/add-task-modal";
import { Task } from "@/src/types";

interface AddTaskButtonProps {
  onSuccess: (task: Task) => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen}>
        <Plus /> Add Task
      </Button>
      <AddTaskModal open={open} onClose={handleClose} onSuccess={onSuccess} />
    </>
  );
};

export default AddTaskButton;
