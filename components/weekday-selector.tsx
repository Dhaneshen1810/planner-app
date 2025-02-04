"use client";

import { Dispatch, SetStateAction } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const daysOfWeek = [
  { label: "Mon", value: "Monday" },
  { label: "Tue", value: "Tuesday" },
  { label: "Wed", value: "Wednesday" },
  { label: "Thu", value: "Thursday" },
  { label: "Fri", value: "Friday" },
  { label: "Sat", value: "Saturday" },
  { label: "Sun", value: "Sunday" },
];

interface WeekdaySelectorProps {
  selectedDays: string[];
  setSelectedDays: Dispatch<SetStateAction<string[]>>;
}

const WeekdaySelector: React.FC<WeekdaySelectorProps> = ({
  selectedDays,
  setSelectedDays,
}) => {
  const handleDayChange = (dayValue: string) => {
    setSelectedDays((prev) =>
      prev.includes(dayValue)
        ? prev.filter((d) => d !== dayValue)
        : [...prev, dayValue]
    );
  };

  const handleSelectAll = () => {
    setSelectedDays(
      selectedDays.length === daysOfWeek.length
        ? []
        : daysOfWeek.map((d) => d.value)
    );
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <Label className="text-lg font-semibold mb-4 block">Repeat:</Label>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="everyday"
              checked={selectedDays.length === daysOfWeek.length}
              onCheckedChange={handleSelectAll}
            />
            <Label
              htmlFor="everyday"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Everyday
            </Label>
          </div>
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-7">
            {daysOfWeek.map(({ label, value }) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={value}
                  checked={selectedDays.includes(value)}
                  onCheckedChange={() => handleDayChange(value)}
                />
                <Label
                  htmlFor={value}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeekdaySelector;
