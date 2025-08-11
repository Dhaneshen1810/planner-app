import { getDayOfWeek, getFormattedDate, getYear } from "@/lib/utils";

const DateBox = () => {
  return (
    <div className="flex p-3 w-full justify-between">
      <p className="font-bold text-5xl">{getDayOfWeek()}</p>
      <div className="flex-col text-right font-bold">
        <p className="text-gray-400">{getFormattedDate()}</p>
        <p className="text-gray-500">{getYear()}</p>
      </div>
    </div>
  );
};

export default DateBox;
