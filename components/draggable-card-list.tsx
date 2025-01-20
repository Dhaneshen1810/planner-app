"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Task } from "@/src/types";
import AddTaskButton from "./buttons/add-task-button";
import RemoveTaskButton from "./buttons/remove-task-button";
import UpdateTaskButton from "./buttons/update-task-button";

interface SortableCardProps {
  card: Task;
  removeTask: (taskId: string) => void;
  updateTask: (updatedTask: Task) => void;
}

const SortableCard: React.FC<SortableCardProps> = ({
  card,
  removeTask,
  updateTask,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-secondary shadow-md rounded-lg p-4 mb-4 flex justify-between items-center"
    >
      <div className="flex items-center gap-1">
        <div className="cursor-move" {...attributes} {...listeners}>
          <GripVertical color="gray" width={15} />
        </div>
        <div className="text-sm sm:text-lg font-semibold">{card.title}</div>
      </div>
      <div className="flex gap-2">
        <UpdateTaskButton task={card} onSuccess={updateTask} />
        <RemoveTaskButton taskId={card.id} onSuccess={removeTask} />
      </div>
    </div>
  );
};

interface DraggableCardListProps {
  initialCards: Task[];
}

const DraggableCardList: React.FC<DraggableCardListProps> = ({
  initialCards,
}) => {
  const [cards, setCards] = useState<Task[] | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCards([...initialCards]);
  }, [initialCards]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items!.findIndex((item) => item.id === active.id);
        const newIndex = items!.findIndex((item) => item.id === over.id);

        const updatedCards = arrayMove(items!, oldIndex, newIndex);

        // Clear the previous debounce timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        // Set a new debounce timer
        debounceTimerRef.current = setTimeout(() => {
          console.log("Updated Cards Order:", updatedCards);
        }, 3000);

        return updatedCards;
      });
    }
  };

  const addNewTask = (task: Task) =>
    setCards((prevCards) => [...(prevCards ?? []), task]);

  const removeTask = (taskId: string) =>
    setCards((prevCards) =>
      (prevCards ?? []).filter((task) => task.id !== taskId)
    );

  const updateTask = (updatedTask: Task) =>
    setCards((prevCards) =>
      (prevCards ?? []).map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );

  if (!cards) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Tasks</h1>
        <AddTaskButton onSuccess={addNewTask} />
      </div>

      {cards.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={cards} strategy={verticalListSortingStrategy}>
            {cards.map((card) => (
              <SortableCard
                key={card.id}
                card={card}
                removeTask={removeTask}
                updateTask={updateTask}
              />
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        <div className="h-3/4 flex justify-center items-center">
          <p className="text-2xl text-red-900">No Task To Display</p>
        </div>
      )}
    </div>
  );
};

export default DraggableCardList;
