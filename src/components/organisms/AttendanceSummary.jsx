import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const AttendanceSummary = ({ 
  students, 
  attendanceRecords, 
  selectedDate, 
  selectedClass,
  onExport 
}) => {
  const getTodayAttendance = () => {
    if (!selectedClass) return { present: 0, absent: 0, late: 0, excused: 0, total: 0 };
    
    const todayRecords = attendanceRecords.filter(
      record => 
        new Date(record.date).toDateString() === selectedDate.toDateString() &&
        record.classId === selectedClass.Id
    );
    
    const stats = {
      present: todayRecords.filter(r => r.status === "present").length,
      absent: todayRecords.filter(r => r.status === "absent").length,
      late: todayRecords.filter(r => r.status === "late").length,
      excused: todayRecords.filter(r => r.status === "excused").length,
      total: students.length
    };
    
    return stats;
  };

  const getOverallStats = () => {
    if (!selectedClass) return { attendanceRate: 0, totalDays: 0 };
    
    const classRecords = attendanceRecords.filter(r => r.classId === selectedClass.Id);
    const uniqueDates = [...new Set(classRecords.map(r => new Date(r.date).toDateString()))];
    const totalRecords = classRecords.length;
    const presentRecords = classRecords.filter(r => r.status === "present" || r.status === "late").length;
    
    return {
      attendanceRate: totalRecords > 0 ? (presentRecords / totalRecords * 100) : 0,
      totalDays: uniqueDates.length
    };
  };

  const todayStats = getTodayAttendance();
  const overallStats = getOverallStats();
  const attendancePercentage = todayStats.total > 0 ? 
    ((todayStats.present + todayStats.late) / todayStats.total * 100) : 0;

  const StatCard = ({ icon, label, value, color = "primary", subtext }) => (
    <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-lg p-4 border border-${color}-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
          {subtext && (
            <p className="text-xs text-gray-500 mt-1">{subtext}</p>
          )}
        </div>
        <div className={`bg-${color}-200 rounded-full p-2`}>
          <ApperIcon name={icon} className={`h-5 w-5 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Today's Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Today's Summary</h3>
          <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${
              attendancePercentage >= 90 ? "from-success-400 to-success-500" :
              attendancePercentage >= 75 ? "from-warning-400 to-warning-500" :
              "from-error-400 to-error-500"
            }`}></div>
            <span className="text-sm font-medium text-gray-600">
              {attendancePercentage.toFixed(1)}% Present
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon="UserCheck"
            label="Present"
            value={todayStats.present}
            color="success"
          />
          <StatCard
            icon="UserX"
            label="Absent"
            value={todayStats.absent}
            color="error"
          />
          <StatCard
            icon="Clock"
            label="Late"
            value={todayStats.late}
            color="warning"
          />
          <StatCard
            icon="FileText"
            label="Excused"
            value={todayStats.excused}
            color="blue"
          />
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Class Overview</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Total Students</span>
            <span className="text-lg font-bold text-gray-900">{todayStats.total}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Overall Attendance Rate</span>
            <span className="text-lg font-bold text-primary-600">
              {overallStats.attendanceRate.toFixed(1)}%
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Days Tracked</span>
            <span className="text-lg font-bold text-gray-900">{overallStats.totalDays}</span>
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Export Data</h3>
        
        <div className="space-y-3">
          <Button
            variant="secondary"
            className="w-full justify-start"
            onClick={() => onExport("today")}
          >
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Export Today's Attendance
          </Button>
          
          <Button
            variant="secondary"
            className="w-full justify-start"
            onClick={() => onExport("class")}
          >
            <ApperIcon name="FileSpreadsheet" className="h-4 w-4 mr-2" />
            Export Class Attendance History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;