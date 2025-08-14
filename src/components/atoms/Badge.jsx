import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Badge = ({ 
  className,
  variant = "default",
  size = "md",
  icon,
  children,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full transition-colors duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    present: "bg-success-100 text-success-800 border border-success-200",
    absent: "bg-error-100 text-error-800 border border-error-200",
    late: "bg-warning-100 text-warning-800 border border-warning-200",
    excused: "bg-blue-100 text-blue-800 border border-blue-200"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm"
  };
  
  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon && <ApperIcon name={icon} className="h-3 w-3 mr-1" />}
      {children}
    </span>
  );
};

export default Badge;