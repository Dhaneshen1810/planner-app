import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Task } from "@/src/types";
import Link from "next/link";

interface UpdateTaskButtonProps {
  task: Task;
}

const UpdateTaskButton: React.FC<UpdateTaskButtonProps> = ({ task }) => {
  return (
    <Link href={`/tasks/update/${task.id}`}>
      <Button variant="ghost" className="p-2 rounded-full bg-yellow-200/50">
        <Pencil width={18} className="text-yellow-700" />
      </Button>
    </Link>
  );
};

export default UpdateTaskButton;
