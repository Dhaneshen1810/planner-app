import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import LoaderIcon from "../loader-icon";

interface RemoveTaskModalProps {
  open: boolean;
  onClose: () => void;
  taskId: string;
  onSuccess: (taskId: string) => void;
}

const RemoveTaskModal: React.FC<RemoveTaskModalProps> = ({
  open,
  onClose,
  taskId,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      onSuccess(taskId);
      onClose();
    } catch (error) {
      console.error("Error removing task:", error);
      toast({
        variant: "destructive",
        title: "Failed to remove task",
        description: "An unexpected error occurred while removing the task.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-lightPurple text-white">
        <DialogHeader>
          <DialogTitle>Remove Task</DialogTitle>
        </DialogHeader>
        <p className="text-center sm:text-left text-lg">
          Are you sure you want to remove this task?
        </p>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleRemove}
            disabled={isLoading}
          >
            Remove {isLoading ? <LoaderIcon /> : <Trash2 width={18} />}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveTaskModal;
