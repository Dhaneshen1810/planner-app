import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import LoaderIcon from "../loader-icon";
import useTasks from "@/hooks/use-tasks";

interface RemoveTaskModalProps {
  open: boolean;
  handleClose: () => void;
  taskId: string;
}

const RemoveTaskModal: React.FC<RemoveTaskModalProps> = ({
  open,
  handleClose,
  taskId,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { deleteEntry } = useTasks();

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      await deleteEntry(taskId);
      handleClose();
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black max-w-[300px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Remove Task</DialogTitle>
        </DialogHeader>
        <p className="text-center sm:text-left text-lg">
          Are you sure you want to remove this task?
        </p>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={handleRemove}
            disabled={isLoading}
          >
            Remove {isLoading ? <LoaderIcon /> : <Trash2 width={18} />}
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveTaskModal;
