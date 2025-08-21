import AddTaskModal from "@/components/modals/create-task-modal";
import { CalendarRange, Settings } from "lucide-react";

const Footer = () => {
  return (
    <div className="flex gap-4 w-full justify-center">
      <button>
        <Settings className="h-6 w-6 hidden" stroke="gray" strokeWidth={2.5} />
      </button>
      <AddTaskModal />
      <button>
        <CalendarRange
          className="h-6 w-6"
          stroke="gray"
          strokeWidth={2.5}
        />
      </button>
    </div>
  );
};

export default Footer;
