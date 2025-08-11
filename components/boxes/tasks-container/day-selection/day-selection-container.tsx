import { getCurrentWeekDays, WeekDay } from "@/lib/utils";
import DayCard from "./day-card";
import useTasks from "@/hooks/use-tasks";

const DaySelectionContainer = () => {
  const { getTasks, activeDate, setActiveDate } = useTasks();
  const currentWeekDays = getCurrentWeekDays();

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
