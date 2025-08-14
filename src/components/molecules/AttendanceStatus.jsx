import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const AttendanceStatus = ({ 
  status, 
  onStatusChange, 
  studentId,
  compact = false 
}) => {
  const statusOptions = [
    { value: "present", label: "Present", icon: "Check", variant: "present" },
    { value: "absent", label: "Absent", icon: "X", variant: "absent" },
    { value: "late", label: "Late", icon: "Clock", variant: "late" },
    { value: "excused", label: "Excused", icon: "FileText", variant: "excused" }
  ];

  if (compact && status) {
    const currentStatus = statusOptions.find(opt => opt.value === status);
    return (
      <Badge 
        variant={currentStatus?.variant || "default"} 
        icon={currentStatus?.icon}
        size="sm"
      >
        {currentStatus?.label || "Unknown"}
      </Badge>
    );
  }

  return (
    <div className="flex space-x-2">
      {statusOptions.map((option) => (
        <Button
          key={option.value}
          size="sm"
          variant={status === option.value ? option.variant : "outline"}
          onClick={() => onStatusChange(studentId, option.value)}
          className={`
            ${status === option.value ? "" : "border-gray-300 text-gray-600 hover:border-gray-400"}
            transition-all duration-200
          `}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default AttendanceStatus;