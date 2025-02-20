import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="h-screen flex flex-col w-full bg-lightPink">
      {/* Header Section */}
      <div className="flex justify-between max-w-2xl self-center p-4 w-full">
        <h1 className="text-2xl font-bold text-white">Tasks</h1>
      </div>

      {/* Skeleton Cards */}
      <div className="flex-1 overflow-y-auto p-4 items-center flex flex-col">
        {[...Array(6)].map((_, index) => (
          <Skeleton
            key={index}
            className="bg-lavender shadow-md rounded-lg p-4 mb-3 w-full max-w-xl h-12 opacity-0 animate-fade-in"
            style={{ animationDelay: `${index * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loading;
