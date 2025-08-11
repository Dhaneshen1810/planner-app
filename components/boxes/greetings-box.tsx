"use client";
// import useTasks from "@/hooks/use-tasks";
import { getTimeOfDay } from "@/lib/utils";
import { Task } from "@/src/stores/tasksStore";
import { CircleCheck, CalendarSync } from "lucide-react";

const GreetingsBox = () => {
  const todayTasks: Task[] = [];

  const tasksLeft = todayTasks.filter(
    (task) => task.recurring_option.length <= 0 && !task.is_completed
  ).length;
  const habitsLeft = todayTasks.filter(
    (task) => task.recurring_option.length > 0 && !task.is_completed
  ).length;

  return (
    <div className="p-3 text-3xl">
      <p>Good {getTimeOfDay()},</p>
      <Sentence numberOfHabits={habitsLeft} numberOfTasks={tasksLeft} />
    </div>
  );
};

interface SecondaryTextProps {
  children: React.ReactNode;
}

const SecondaryText = ({ children }: SecondaryTextProps) => {
  return <span className="text-gray-500">{children}</span>;
};

interface SentenceProps {
  numberOfTasks: number;
  numberOfHabits: number;
}

const Sentence: React.FC<SentenceProps> = ({
  numberOfHabits,
  numberOfTasks,
}) => {
  const hasTasks = numberOfTasks > 0;
  const hasHabits = numberOfHabits > 0;

  if (hasHabits && hasTasks) {
    return (
      <p>
        <SecondaryText>You have</SecondaryText>{" "}
        <CircleCheck className="inline align-middle mx-1  text-3xl mb-1" />
        {numberOfTasks} tasks <SecondaryText>and</SecondaryText>{" "}
        <CalendarSync className="inline align-middle mx-1  text-3xl mb-1" />
        {numberOfHabits} habits <SecondaryText> left today.</SecondaryText>
      </p>
    );
  }

  if (hasTasks) {
    return (
      <p>
        <SecondaryText>You have</SecondaryText>{" "}
        <CircleCheck className="inline align-middle mx-1  text-3xl mb-1" />
        {numberOfTasks} tasks<SecondaryText> left today.</SecondaryText>
      </p>
    );
  }

  return (
    <p>
      <SecondaryText>You have</SecondaryText>{" "}
      <CalendarSync className="inline align-middle mx-1  text-3xl mb-1" />
      {numberOfHabits} habits<SecondaryText> left today.</SecondaryText>
    </p>
  );
};

export default GreetingsBox;
