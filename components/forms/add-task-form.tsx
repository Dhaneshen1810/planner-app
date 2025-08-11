"use client";

import React, { useState } from "react";
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
import { RECURRING_OPTION } from "@/src/types";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";
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

export type TaskFormValues = z.infer<typeof taskSchema>;

interface AddTaskFormProps {
  onSuccess: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { createEntry } = useTasks();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      time: undefined,
      date: undefined,
      recurring_option: [],
    },
  });

  const handleSubmit = async (data: TaskFormValues) => {
    setIsLoading(true);
    try {
      await createEntry(data);

      form.reset();

      onSuccess();
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        variant: "destructive",
        title: "Failed to add task",
        description: "An unexpected error occurred",
      });
    } finally {
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
                    className="bg-white text-black border-black font-bold placeholder:font-bold py-7 text-xl placeholder:text-xl leading-none md:text-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <TaskScheduler />
          <TimeSelector />
          <DialogFooter className="flex flex-row gap-2 justify-end">
            {/* <Link href="/tasks">
              <Button variant="tertiary" disabled={isLoading} className="mt-5">
                Cancel
              </Button>
            </Link> */}
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className="mt-5 w-full bg-black"
            >
              {isLoading && <LoaderIcon />} Create
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default AddTaskForm;
