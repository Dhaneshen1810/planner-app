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
import LoaderIcon from "../loader-icon";
import { RECURRING_OPTION, Task } from "@/src/types";
import axios from "axios";
import { isSuccessfullResponse } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";

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

const UpdateTaskForm = ({ task }: { task?: Task }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      let response;
      if (task) {
        // Update existing task
        response = await axios.put(`/api/tasks/${task.id}`, { data });
      } else {
        // Create new task
        response = await axios.post("/api/tasks", { data });
      }

      if (isSuccessfullResponse(response.status)) {
        router.push("/tasks");
      }
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
    <div className="w-full max-w-2xl">
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
                    className="bg-white text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <TaskScheduler />
          <TimeSelector />
          <DialogFooter>
            <Link href="/tasks">
              <Button variant="tertiary" disabled={isLoading}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="secondary" disabled={isLoading}>
              {isLoading && <LoaderIcon />} {task ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default UpdateTaskForm;
