"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { DialogFooter } from "../ui/dialog";
import { RECURRING_OPTION } from "@/src/types";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";
import { Task } from "@/src/stores/tasksStore";
import RemoveTaskModal from "../modals/remove-task-modal";
import { Trash2 } from "lucide-react";
import useTasks from "@/hooks/use-tasks";

const TaskScheduler = dynamic(() => import("../task-scheduler"), {
  ssr: false,
});

const TimeSelector = dynamic(() => import("../time-selector"), { ssr: false });

const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Please enter a title")
    .max(100, "Title must not exceed 100 characters"),
  date: z.date().optional(),
  time: z.string().optional(),
  recurring_option: z.array(z.nativeEnum(RECURRING_OPTION)),
});

export type UpdateTaskFormValues = z.infer<typeof taskSchema>;

interface UpdateTaskFormProps {
  onSuccess: () => void;
  task: Task;
}

const UpdateTaskForm: React.FC<UpdateTaskFormProps> = ({ task, onSuccess }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { updateEntry } = useTasks();

  const form = useForm<UpdateTaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || "",
      time: task?.time || undefined,
      date: task?.date ? new Date(task.date + "T00:00:00") : undefined,
      recurring_option: task?.recurring_option || [],
    },
  });

  // Update form values if the task prop changes
  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        time: task.time || undefined,
        date: task?.date ? new Date(task.date + "T00:00:00") : undefined,
        recurring_option: task.recurring_option || [],
      });
    }
  }, [task, form]);

  const handleSubmit = async (data: UpdateTaskFormValues) => {
    setIsLoading(true);

    try {
      await updateEntry(task.id, data);
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: task ? "Failed to update task" : "Failed to add task",
        description: "An unexpected error occurred",
      });
      console.error("Error:", error);
    } finally {
      form.reset();
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl px-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Title"
                    className="text-black border-gray-400 font-bold placeholder:font-bold py-7 text-xl placeholder:text-xl leading-none md:text-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <TaskScheduler />
          <TimeSelector />
          <DialogFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className="w-full bg-black text-white"
            >
              Update
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setDeleteModalOpen(true)}
              disabled={isLoading}
            >
              Remove <Trash2 width={18} />
            </Button>
          </DialogFooter>
        </form>
      </Form>
      <RemoveTaskModal
        open={deleteModalOpen}
        handleClose={() => setDeleteModalOpen(false)}
        taskId={task.id}
      />
    </div>
  );
};

export default UpdateTaskForm;
