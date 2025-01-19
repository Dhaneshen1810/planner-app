import { CreateTaskInput, RECURRING_OPTION } from "@/src/types";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(`${process.env.SERVER_URL}/tasks`);

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const data = await response.json();

    return NextResponse.json({ success: true, tasks: data });
  } catch (error: unknown) {
    console.error("Error fetching tasks:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("test", body, body.title);

    if (!body.title) {
      return NextResponse.json(
        { success: false, message: "Missing input" },
        { status: 500 }
      );
    }

    const newTask: CreateTaskInput = {
      title: body.title,
      date: "2025-01-18",
      is_completed: false,
      recurring_option: RECURRING_OPTION.NONE,
    };

    // Use axios to send the POST request
    const response = await axios.post(
      `${process.env.SERVER_URL}/tasks`,
      newTask,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ success: true, task: response.data });
  } catch (error: unknown) {
    console.error("Error creating task:", error);

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
