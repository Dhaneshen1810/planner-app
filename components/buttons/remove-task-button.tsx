"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import RemoveTaskModal from "../modals/remove-task-modal";
import { Trash2 } from "lucide-react";

interface RemoveTaskButtonProps {
  taskId: string;
  onSuccess: (taskId: string) => void;
}

const RemoveTaskButton: React.FC<RemoveTaskButtonProps> = ({
  onSuccess,
  taskId,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Button variant="ghost" className="p-0" onClick={handleOpen}>
        <Trash2 width={18} />
      </Button>
      <RemoveTaskModal
        open={open}
        onClose={handleClose}
        taskId={taskId}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default RemoveTaskButton;
