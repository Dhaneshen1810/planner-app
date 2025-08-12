import { getCurrentWeekDays, getLocalDate, WeekDay } from "@/lib/utils";
import DayCard from "./day-card";
import useTasks from "@/hooks/use-tasks";
import { useEffect } from "react";

const DaySelectionContainer = () => {
  const { getTasks, activeDate, setActiveDate, setTodayTasks } = useTasks();
  const currentWeekDays = getCurrentWeekDays();

  const getInitialTasks = async () => {
    const todayDate = getLocalDate();
    const tasks = await getTasks(todayDate);
    setTodayTasks(tasks);
  };

  useEffect(() => {
    getInitialTasks();
  }, []);

  const handleSelect = async (weekday: WeekDay) => {
    setActiveDate(weekday.date);
    getTasks(weekday.date);
  };

  return (
    <div className="flex justify-between">
      {currentWeekDays.map((weekday) => (
        <DayCard
          key={weekday.day}
          weekDay={weekday}
          isActive={activeDate === weekday.date}
          onSelect={() => handleSelect(weekday)}
        />
      ))}
    </div>
  );
};

export default DaySelectionContainer;
