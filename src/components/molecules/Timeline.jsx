import { format } from "date-fns";
import Badge from "@/components/atoms/Badge";

const Timeline = ({ records, getClassName }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-success-500";
      case "absent":
        return "bg-error-500";
      case "late":
        return "bg-warning-500";
      case "excused":
        return "bg-primary-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "present":
        return "success";
      case "absent":
        return "error";
      case "late":
        return "warning";
      case "excused":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      <div className="space-y-4">
        {records.map((record, index) => (
          <div key={record.Id} className="relative flex items-start">
            {/* Timeline dot */}
            <div className={`
              relative z-10 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center
              ${getStatusColor(record.status)}
            `}>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            
            {/* Content */}
            <div className="ml-4 flex-1 min-w-0">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    {getClassName(record.classId)}
                  </h4>
                  <Badge variant={getStatusBadgeVariant(record.status)}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Date:</span>
                    {format(new Date(record.date), "MMMM d, yyyy")}
                  </div>
                  
                  {record.markedAt && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Marked:</span>
                      {format(new Date(record.markedAt), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  )}
                  
                  {record.notes && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <span className="font-medium">Note:</span> {record.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;