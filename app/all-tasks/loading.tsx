import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="h-screen flex flex-col w-full">
      {/* Header Section */}
      <div className="p-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
      </div>

      {/* Skeleton Cards */}
      <div className="flex-1 overflow-y-auto p-4 items-center flex flex-col">
        {[...Array(3)].map((_, index) => (
          <Skeleton
            key={index}
            className="bg-secondary shadow-md rounded-lg p-4 mb-3 w-full max-w-xl h-12"
          />
        ))}
      </div>
    </div>
  );
};

export default Loading;
