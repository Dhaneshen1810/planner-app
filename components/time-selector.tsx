"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";

const hours = Array.from({ length: 12 }, (_, i) =>
  (i + 1).toString().padStart(2, "0")
);
const minutes = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0")
);

const TimeSelector = () => {
  const { setValue, watch } = useFormContext();
  const timeValue = watch("time");

  const [time, setTime] = React.useState(() => {
    if (timeValue) {
      const [timePart, period] = timeValue.split(" ");
      const [h, m] = timePart.split(":");
      return { hours: h, minutes: m, isPM: period === "PM" };
    }
    return { hours: "12", minutes: "00", isPM: false };
  });

  const [tempTime, setTempTime] = React.useState(time);
  const [isOpen, setIsOpen] = React.useState(false);
  const [showTime, setShowTime] = React.useState(!!timeValue);

  React.useEffect(() => {
    if (showTime) {
      const timeString = `${tempTime.hours}:${tempTime.minutes} ${
        tempTime.isPM ? "PM" : "AM"
      }`;
      setValue("time", timeString);
    }

    if (!showTime && isOpen) {
      setIsOpen(false);
    }
  }, [showTime, isOpen, tempTime, setValue]);

  const handleConfirm = () => {
    setTime(tempTime);
    setIsOpen(false);
    const timeString = `${tempTime.hours}:${tempTime.minutes} ${
      tempTime.isPM ? "PM" : "AM"
    }`;
    setValue("time", timeString);
  };

  const toggleAMPM = () => {
    setTempTime((prev) => ({ ...prev, isPM: !prev.isPM }));
  };

  const handleToggleShowTime = (checked: boolean) => {
    setShowTime(checked);
    if (!checked) setValue("time", undefined);
  };

  return (
    <div className="flex flex-col">
      {/* Switch to toggle showing/hiding the time */}
      <div className="flex gap-2 justify-end">
        <div className="flex gap-1 items-center font-bold">
          <Clock className="h-5 w-5" />
          <Label htmlFor="show-time-switch">Set Time</Label>
        </div>
        <Switch
          checked={showTime}
          onCheckedChange={handleToggleShowTime}
          id="show-time-switch"
          className="data-[state=checked]:bg-black"
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {/* This container is always rendered. Its classes change based on showTime */}
          <div
            className={`w-full max-w-sm space-y-4 rounded-lg p-4 shadow-md transition-all duration-300 text-black mt-3 ${
              showTime
                ? "border border-gray-200 opacity-100 translate-y-0 cursor-pointer"
                : "border border-gray-200 opacity-50 translate-y-2 cursor-not-allowed pointer-events-none"
            }`}
          >
            <div className="flex items-center justify-center">
              <Input
                readOnly
                value={
                  showTime
                    ? `${time.hours}:${time.minutes} ${time.isPM ? "PM" : "AM"}`
                    : "Anytime"
                }
                className="text-center text-2xl font-bold text-black"
              />
            </div>
          </div>
        </DialogTrigger>

        {/* Render the dialog content only when time is enabled */}
        {showTime && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center text-black">
                Select Time
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-center space-x-4 p-4">
              <div className="w-20 text-center">
                <Label className="text-black">Hours</Label>
                <ScrollArea className="h-[200px] w-full rounded-md border border-gray-200">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className={`cursor-pointer p-2 transition-all duration-300 ${
                        tempTime.hours === hour
                          ? "bg-gray-100 text-black"
                          : "hover:bg-gray-50 text-gray-400"
                      }`}
                      onClick={() =>
                        setTempTime((prev) => ({ ...prev, hours: hour }))
                      }
                    >
                      {hour}
                    </div>
                  ))}
                </ScrollArea>
              </div>
              <div className="w-20 text-center">
                <Label className="text-gray-500">Minutes</Label>
                <ScrollArea className="h-[200px] w-full rounded-md border border-gray-200">
                  {minutes.map((minute) => (
                    <div
                      key={minute}
                      className={`cursor-pointer p-2 transition-all duration-300 ${
                        tempTime.minutes === minute
                          ? "bg-gray-100 text-gray-500"
                          : "hover:bg-gray-50 text-gray-400"
                      }`}
                      onClick={() =>
                        setTempTime((prev) => ({ ...prev, minutes: minute }))
                      }
                    >
                      {minute}
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={toggleAMPM}
                variant="outline"
                className={`w-20 transition-all duration-300 hover:text-white ${
                  tempTime.isPM
                    ? "bg-gray-500 text-white hover:bg-gray-600"
                    : "bg-gray-500 text-white hover:bg-gray-600"
                }`}
              >
                {tempTime.isPM ? "PM" : "AM"}
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-white text-black hover:bg-gray-600 transition-all duration-300"
              >
                Confirm
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default TimeSelector;
