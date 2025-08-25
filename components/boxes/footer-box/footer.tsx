import AddTaskModal from "@/components/modals/create-task-modal";
import { CalendarRange, Settings } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="w-full sticky bottom-0 inset-x-0">
      <div className="mx-auto max-w-md px-4 pb-4">
        <div className="flex items-center justify-center gap-6">

          <button
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 bg-white shadow-sm hover:bg-neutral-50 active:scale-95 transition hidden"
            aria-label="Settings"
          >
            <Settings className="h-6 w-6" stroke="gray" strokeWidth={2.5} />
          </button>

          <AddTaskModal />

          {/**
           * clicking the calendar icon will naviate you to task list page.
           */}
          <Link
            href="/calendar"
            aria-label="Open calendar"
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 bg-white shadow-sm hover:bg-neutral-50 active:scale-95 transition"
          >
            <CalendarRange className="h-6 w-6" stroke="gray" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
