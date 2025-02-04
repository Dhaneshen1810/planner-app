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
import WeekdaySelector from "../weekday-selector";

const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Please enter a title")
    .max(100, "Title must not exceed 100 characters"),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

interface AddTaskFormProps {
  onSubmit: (data: TaskFormValues, selectedDays: string[]) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "" },
  });

  const handleSubmit = (data: TaskFormValues) => {
    setIsLoading(true);
    onSubmit(data, selectedDays);
    form.reset();
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
        <WeekdaySelector
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
        />
        <DialogFooter>
          <Button type="submit" variant="default" disabled={isLoading}>
            {isLoading && <LoaderIcon />} Add Task
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddTaskForm;
