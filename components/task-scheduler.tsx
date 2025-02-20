"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function TaskScheduler() {
  const { setValue, watch } = useFormContext();
  const recurringOptionValue = watch("recurring_option");
  const dateValue = watch("date");

  const [taskType, setTaskType] = useState(
    dateValue ? "one-time" : "recurring"
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(dateValue);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    recurringOptionValue || []
  );

  useEffect(() => {
    setSelectedDays(recurringOptionValue || []);
    setSelectedDate(dateValue);
  }, [recurringOptionValue, dateValue]);

  const handleTaskTypeChange = (value: string) => {
    setTaskType(value);
    if (value === "one-time") {
      setSelectedDays([]);
      setValue("recurring_option", []);
    } else {
      setSelectedDate(undefined);
      setValue("date", undefined);
    }
  };

  const handleDayChange = (day: string) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(newDays);
    if (taskType === "recurring") {
      setValue("recurring_option", newDays);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (taskType === "one-time") {
      setValue("date", date);
    }
  };

  return (
    <Card className="w-full min-w-xl bg-lightPurple border-lightPurple text-white">
      <CardHeader>
        <CardTitle>Schedule Task</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <RadioGroup
          value={taskType}
          onValueChange={handleTaskTypeChange}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="one-time"
              id="one-time"
              className="bg-white"
            />
            <Label htmlFor="one-time">One-time task</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="recurring"
              id="recurring"
              className="bg-white"
            />
            <Label htmlFor="recurring">Recurring task</Label>
          </div>
        </RadioGroup>

        {taskType === "one-time" && (
          <div className="grid gap-2">
            <Label htmlFor="date">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {taskType === "recurring" && (
          <div className="grid gap-4">
            <Label>Select Days</Label>
            <div className="grid grid-cols-7 gap-4">
              {daysOfWeek.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={day}
                    checked={selectedDays.includes(day)}
                    onCheckedChange={() => handleDayChange(day)}
                  />
                  <Label htmlFor={day}>{day.substring(0, 3)}</Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
