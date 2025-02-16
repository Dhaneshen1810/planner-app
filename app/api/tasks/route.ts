import { CreateTaskInput } from "@/src/types";
import axios from "axios";
import { NextResponse } from "next/server";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    let fetchUrl = `${process.env.SERVER_URL}/tasks`;

    if (date) {
      fetchUrl += `?date_str=${encodeURIComponent(date)}`;
    }

    const response = await fetch(fetchUrl);

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

    const data = body.data;

    const newTask: CreateTaskInput = {
      title: data.title,
      date: data.date || undefined,
      is_completed: false,
      recurring_option: data.recurring_option || [],
      time: data.time || undefined,
      position: 0,
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

export async function PUT(req: Request) {
  try {
    const updatedTasks = await req.json();

    if (!Array.isArray(updatedTasks)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input. Expected an array of tasks.",
        },
        { status: 400 }
      );
    }

    const response = await axios.put(
      `${process.env.SERVER_URL}/tasks`,
      updatedTasks,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      success: true,
      updatedTasks: response.data,
    });
  } catch (error: unknown) {
    console.error("Error updating tasks:", error);

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
