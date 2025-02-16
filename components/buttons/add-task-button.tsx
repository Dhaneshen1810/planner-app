"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";

const AddTaskButton = () => {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <Link href="/tasks/create">
          <Button
            className="fixed bottom-5 right-5 rounded-full p-3 shadow-lg"
            size="icon"
            variant="default"
          >
            <Plus className="h-9 w-9" />
          </Button>
        </Link>
      ) : (
        <Link href="/tasks/create">
          <Button>
            <Plus /> Add Task
          </Button>
        </Link>
      )}
    </>
  );
};

export default AddTaskButton;
