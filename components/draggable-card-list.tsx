"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
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
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

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
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          console.log("success");
        }
      })
      .catch((error) => {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Failed to update task",
        });

        setIsCompleted(completed);
      });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-secondary shadow-md rounded-lg p-4 mb-3 flex justify-between items-center w-full max-w-xl"
    >
      <div className="flex items-center gap-1">
        <div
          className="cursor-move"
          style={{ touchAction: "none" }}
          {...attributes}
          {...listeners}
        >
          <GripVertical color="gray" width={15} />
        </div>
        <div
          className={`text-sm sm:text-lg font-semibold cursor-pointer ${
            isCompleted && "line-through"
          } ${isCompleted ? "text-gray-200" : "text-white"}`}
          onClick={() => handleTitleClick(isCompleted)}
        >
          {card.title}
        </div>
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
  const pendingUpdateRef = useRef<Task[] | null>(null);

  useEffect(() => {
    setCards([...initialCards]);
  }, [initialCards]);

  useEffect(() => {
    // Handle updates before the user refreshes or leaves the page
    const handleBeforeUnload = () => {
      if (pendingUpdateRef.current) {
        updateTasksInDb(pendingUpdateRef.current); // Send the pending updates
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Optional: Adds a slight delay before dragging to prevent accidental drags
        tolerance: 5, // Optional: Prevents accidental drags when tapping
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateTasksInDb = async (updatedCards: Task[]) => {
    await axios
      .put("/api/tasks", updatedCards)
      .then((res) => {
        console.log("Tasks updated successfully:", res.data);
      })
      .catch((error) => {
        console.error("Error updating tasks:", error);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items!.findIndex((item) => item.id === active.id);
        const newIndex = items!.findIndex((item) => item.id === over.id);

        const updatedCards = arrayMove(items!, oldIndex, newIndex).map(
          (card, index) => {
            return {
              ...card,
              position: index + 1,
            };
          }
        );

        // Clear the previous debounce timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        pendingUpdateRef.current = updatedCards;

        // Set a new debounce timer
        debounceTimerRef.current = setTimeout(() => {
          console.log("Updated Cards Order:", updatedCards);
          updateTasksInDb(updatedCards);
        }, 1000);

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
    <div className="h-screen flex flex-col w-full">
      {/* Header Section */}
      <div className="p-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <AddTaskButton onSuccess={addNewTask} />
        </div>
      </div>

      {/* Scrollable Content Section */}
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
                  updateTask={updateTask}
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
