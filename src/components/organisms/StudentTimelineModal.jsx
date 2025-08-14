import { useState, useEffect } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Timeline from "@/components/molecules/Timeline";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { attendanceService } from "@/services/api/attendanceService";
import { classService } from "@/services/api/classService";

const StudentTimelineModal = ({ student, isOpen, onClose }) => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && student) {
      loadStudentTimeline();
    }
  }, [isOpen, student]);

  const loadStudentTimeline = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [attendanceData, classData] = await Promise.all([
        attendanceService.getByStudentId(student.Id),
        classService.getAll()
      ]);

      // Sort by date descending (most recent first)
      const sortedAttendance = attendanceData.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );

      setAttendanceHistory(sortedAttendance);
      setClasses(classData);
    } catch (err) {
      console.error("Error loading student timeline:", err);
      setError("Failed to load attendance history");
    } finally {
      setLoading(false);
    }
  };

  const getClassName = (classId) => {
    const classObj = classes.find(c => c.Id === classId);
    return classObj ? classObj.name : `Class ${classId}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-lg font-bold text-primary-700">
                {student?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?"}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {student?.name || "Student"} - Attendance History
              </h2>
              <p className="text-sm text-gray-500">
                {student?.email || ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex justify-center py-12">
              <Loading />
            </div>
          )}

          {error && (
            <div className="py-8">
              <Error message={error} />
            </div>
          )}

          {!loading && !error && attendanceHistory.length === 0 && (
            <div className="py-8">
              <Empty message="No attendance records found for this student" />
            </div>
          )}

          {!loading && !error && attendanceHistory.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Timeline View
                </h3>
                <div className="text-sm text-gray-500">
                  {attendanceHistory.length} record{attendanceHistory.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <Timeline 
                records={attendanceHistory}
                getClassName={getClassName}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
                <span>Present</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-error-500 rounded-full mr-2"></div>
                <span>Absent</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-warning-500 rounded-full mr-2"></div>
                <span>Late</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
                <span>Excused</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTimelineModal;