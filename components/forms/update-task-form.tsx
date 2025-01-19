import React from "react";
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
import { Task } from "@/src/types";

const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Please enter a title")
    .max(50, "Title must not exceed 50 characters"),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

interface UpdateTaskFormProps {
  currentTask: Task;
  onSubmit: (data: TaskFormValues) => void;
}

const UpdateTaskForm: React.FC<UpdateTaskFormProps> = ({
  currentTask,
  onSubmit,
}) => {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: currentTask.title }, // Prepopulate with the initial title
  });

  const handleSubmit = (data: TaskFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter task title"
                  className="bg-white text-black"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" variant="default">
            Update Task
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UpdateTaskForm;
