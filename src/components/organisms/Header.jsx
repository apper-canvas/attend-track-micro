import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import DatePicker from "@/components/molecules/DatePicker";
import ClassSelector from "@/components/molecules/ClassSelector";

const Header = ({ 
  selectedDate, 
  onDateChange, 
  classes, 
  selectedClass, 
  onClassChange 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg p-2 mr-3">
              <ApperIcon name="Users" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                AttendTrack
              </h1>
              <p className="text-xs text-gray-500">Student Attendance Management</p>
            </div>
          </div>

          {/* Date and Current Time */}
          <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Calendar" className="h-4 w-4" />
              <span>{format(new Date(), "EEEE, MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Clock" className="h-4 w-4" />
              <span>{format(new Date(), "h:mm a")}</span>
            </div>
          </div>
        </div>
        
        {/* Controls Row */}
        <div className="pb-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex-1 max-w-xs">
              <ClassSelector
                classes={classes}
                selectedClass={selectedClass}
                onClassChange={onClassChange}
              />
            </div>
            
            <div className="w-full md:w-auto md:min-w-[200px]">
              <DatePicker
                label="Attendance Date"
                value={selectedDate}
                onChange={onDateChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;