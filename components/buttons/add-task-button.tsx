"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddTaskModal from "../modals/add-task-modal";
import { Task } from "@/src/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface AddTaskButtonProps {
  onSuccess: (task: Task) => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onSuccess }) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <>
      {isMobile ? (
        <Button
          className="fixed bottom-5 right-5 rounded-full p-3 shadow-lg"
          onClick={handleOpen}
          size="icon"
          variant="default"
        >
          <Plus className="h-9 w-9" />
        </Button>
      ) : (
        <Button onClick={handleOpen}>
          <Plus /> Add Task
        </Button>
      )}
      <AddTaskModal open={open} onClose={handleClose} onSuccess={onSuccess} />
    </>
  );
};

export default AddTaskButton;
