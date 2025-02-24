"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, GripVertical } from "lucide-react";
import { Task } from "@/src/types";
import AddTaskButton from "./buttons/add-task-button";
import RemoveTaskButton from "./buttons/remove-task-button";
import UpdateTaskButton from "./buttons/update-task-button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Button } from "./ui/button";

interface SortableCardProps {
  card: Task;
  removeTask: (taskId: string) => void;
}

const SortableCard: React.FC<SortableCardProps> = ({ card, removeTask }) => {
  const { toast } = useToast();
  const [isCompleted, setIsCompleted] = useState<boolean>(card.is_completed);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTitleClick = async (completed: boolean) => {
    setIsCompleted(!completed);

    await axios
      .put(
        `/api/tasks/${card.id}`,
        {
          task: { ...card, is_completed: !completed },
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        if (res.data.success) console.log("success");
      })
      .catch((error) => {
        console.log(error);
        toast({ variant: "destructive", title: "Failed to update task" });
        setIsCompleted(completed);
      });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`shadow-md rounded-lg p-4 mb-3 flex justify-between items-center w-full max-w-xl border-purple-300 border-4 ${
        isCompleted ? "bg-gray-400" : "bg-lavender"
      }`}
    >
      <div className="flex items-center gap-1">
        <div
          className="cursor-move"
          style={{ touchAction: "none" }} // Ensures proper drag handling
          {...attributes}
          {...listeners}
        >
          <GripVertical color="gray" width={15} />
        </div>
        <div className="flex flex-col gap-1">
          <div
            className={`text-sm sm:text-lg font-semibold cursor-pointer ${
              isCompleted ? "line-through text-gray-200" : "text-white"
            }`}
            onClick={() => handleTitleClick(isCompleted)}
          >
            {card.title}
          </div>
          {card.time && (
            <div className="text-white flex gap-1">
              <div>{card.time}</div>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <UpdateTaskButton task={card} />
        <RemoveTaskButton taskId={card.id} onSuccess={removeTask} />
      </div>
    </div>
  );
};

interface DraggableCardListProps {
  initialCards: Task[];
  allTasks?: boolean;
}

const DraggableCardList: React.FC<DraggableCardListProps> = ({
  initialCards,
  allTasks,
}) => {
  const [cards, setCards] = useState<Task[] | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdateRef = useRef<Task[] | null>(null);

  useEffect(() => {
    setCards([...initialCards]);
  }, [initialCards]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (pendingUpdateRef.current) updateTasksInDb(pendingUpdateRef.current);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Always initialize sensors
  const pointerSensor = useSensor(PointerSensor);
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250, // Prevents accidental drags
      tolerance: 5, // Helps avoid false positives
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });

  // Use correct sensors dynamically without breaking React Hooks
  const sensors = useSensors(pointerSensor, touchSensor, keyboardSensor);

  const updateTasksInDb = async (updatedCards: Task[]) => {
    await axios
      .put("/api/tasks", updatedCards)
      .then((res) => console.log("Tasks updated successfully:", res.data))
      .catch((error) => console.error("Error updating tasks:", error));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setCards((items) => {
      const oldIndex = items!.findIndex((item) => item.id === active.id);
      const newIndex = items!.findIndex((item) => item.id === over.id);

      const updatedCards = arrayMove(items!, oldIndex, newIndex).map(
        (card, index) => ({ ...card, position: index + 1 })
      );

      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      pendingUpdateRef.current = updatedCards;

      debounceTimerRef.current = setTimeout(() => {
        updateTasksInDb(updatedCards);
      }, 1000);

      return updatedCards;
    });
  };

  const removeTask = (taskId: string) =>
    setCards((prevCards) =>
      (prevCards ?? []).filter((task) => task.id !== taskId)
    );

  if (!cards) return <p className="text-center">Loading...</p>;

  return (
    <div className="h-screen flex flex-col w-full">
      <div className="flex justify-between max-w-2xl self-center p-4 w-full ">
        <Link href="/">
          {" "}
          <h1 className="text-2xl font-bold text-white">Tasks</h1>
        </Link>
        <div className="flex gap-2">
          <AddTaskButton />
          {allTasks ? (
            <Link href="/tasks">
              <Button variant="purple">Today`s Task</Button>
            </Link>
          ) : (
            <Link href="/all-tasks">
              <Button variant="purple">All Task</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 items-center flex flex-col">
        {cards.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={cards}
              strategy={verticalListSortingStrategy}
            >
              {cards.map((card) => (
                <SortableCard
                  key={card.id}
                  card={card}
                  removeTask={removeTask}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <div className="h-full flex justify-center items-center">
            <p className="text-2xl text-red-900">No Task To Display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraggableCardList;
