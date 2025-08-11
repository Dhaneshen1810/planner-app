import { WeekDay } from "@/lib/utils";
import { parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

interface DayCardProps {
  weekDay: WeekDay;
  isActive: boolean;
  onSelect: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ weekDay, isActive, onSelect }) => {
  // Render day-of-month in Edmonton to avoid off-by-one
  const formattedDate = formatInTimeZone(
    parseISO(weekDay.date),
    "America/Edmonton",
    "d"
  );

  return (
    <button
      onClick={onSelect}
      className={`flex flex-col items-center justify-center w-12 h-16 rounded-xl cursor-pointer ${
        isActive ? "bg-white shadow-md border border-gray-300" : ""
      }`}
    >
      <p className={`${isActive ? "text-black" : "text-gray-400"} font-bold`}>
        {formattedDate}
      </p>
      <p className={`${isActive ? "text-red-400" : "text-gray-400"} text-xs`}>
        {weekDay.day}
      </p>
    </button>
  );
};

export default DayCard;
