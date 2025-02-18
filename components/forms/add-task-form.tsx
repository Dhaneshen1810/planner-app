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
import axios from "axios";
import { isSuccessfullResponse } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

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

const AddTaskForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      const response = await axios.post("/api/tasks", { data });
      console.log("status", response.status);
      if (isSuccessfullResponse(response.status)) {
        router.push("/tasks");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to add task",
        description: "An unexpected error occurred",
      });
      console.error("Error adding task:", error);
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
            <Button type="submit" variant="tertiary" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="secondary" disabled={isLoading}>
              {isLoading && <LoaderIcon />} Create
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default AddTaskForm;
