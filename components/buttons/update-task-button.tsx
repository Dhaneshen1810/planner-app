"use client";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Task } from "@/src/types";
import UpdateTaskModal from "../modals/update-task-modal";

interface UpdateTaskButtonProps {
  task: Task;
  onSuccess: (task: Task) => void;
}

const UpdateTaskButton: React.FC<UpdateTaskButtonProps> = ({
  onSuccess,
  task,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Button variant="ghost" className="p-0" onClick={handleOpen}>
        <Pencil width={18} />
      </Button>
      <UpdateTaskModal
        open={open}
        onClose={handleClose}
        onSuccess={onSuccess}
        task={task}
      />
    </>
  );
};

export default UpdateTaskButton;
