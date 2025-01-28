import { RECURRING_OPTION, UpdateTaskInput } from "@/src/types";
import axios from "axios";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;

    if (!taskId) {
      return NextResponse.json(
        { success: false, message: "Task ID is required" },
        { status: 400 }
      );
    }

    const response = await axios.delete(
      `${process.env.SERVER_URL}/tasks/${taskId}`
    );

    if (response.status === 200) {
      return NextResponse.json({
        success: true,
        message: "Task successfully deleted",
      });
    }

    throw new Error("Failed to delete task");
  } catch (error: unknown) {
    console.error("Error deleting task:", error);

    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : error instanceof Error
        ? error.message
        : "Unknown error";

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params?.id;

    if (!taskId) {
      return NextResponse.json(
        { success: false, message: "Task ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const task = body.task as Partial<UpdateTaskInput>;

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Missing input" },
        { status: 400 }
      );
    }

    if (!task.title || typeof task.title !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Task title is required and must be a string",
        },
        { status: 400 }
      );
    }

    if (typeof task.position !== "number" || task.position < 0) {
      return NextResponse.json(
        { success: false, message: "Task position must be a valid number" },
        { status: 400 }
      );
    }

    const updatedTask: UpdateTaskInput = {
      title: task.title,
      date: task.date || "2025-01-18",
      is_completed: task.is_completed || false,
      recurring_option: task.recurring_option || RECURRING_OPTION.NONE,
      position: task.position,
    };

    const response = await axios.put(
      `${process.env.SERVER_URL}/tasks/${taskId}`,
      updatedTask,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return NextResponse.json({
        success: true,
        task: response.data,
        message: "Task successfully updated",
      });
    }

    throw new Error("Failed to update task");
  } catch (error: unknown) {
    console.error("Error updating task:", error);

    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : error instanceof Error
        ? error.message
        : "Unknown error";

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
