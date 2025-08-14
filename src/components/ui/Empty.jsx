import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  className,
  icon = "Users",
  title = "No students found",
  message = "Get started by adding students to your class roster.",
  actionLabel,
  onAction
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-full p-6 mb-6">
        <ApperIcon name={icon} className="h-12 w-12 text-primary-500" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {message}
      </p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:from-primary-700 hover:to-accent-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;