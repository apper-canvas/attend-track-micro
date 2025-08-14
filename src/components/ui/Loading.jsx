import { cn } from "@/utils/cn";

const Loading = ({ className, type = "skeleton" }) => {
  if (type === "skeleton") {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="space-y-4">
          {/* Header skeleton */}
          <div className="bg-gray-200 h-16 rounded-lg"></div>
          
          {/* Table skeleton */}
          <div className="space-y-3">
            <div className="bg-gray-200 h-12 rounded-md"></div>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 h-16 rounded-md"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="text-gray-600 font-medium">Loading attendance data...</span>
      </div>
    </div>
  );
};

export default Loading;