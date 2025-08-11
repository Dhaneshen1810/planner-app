import DateBox from "./date-box";
import GreetingsBox from "./greetings-box";
import TaskContainer from "./tasks-container/task-container";

const MainBox = () => {
  return (
    <div className="flex flex-col min-h-screen max-w-md w-full mx-auto bg-black text-white">
      <div className="px-4">
        <DateBox />
        <GreetingsBox />
      </div>

      <div className="mt-auto">
        <TaskContainer />
      </div>
    </div>
  );
};

export default MainBox;
