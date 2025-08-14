import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import AttendanceStatus from "@/components/molecules/AttendanceStatus";
import Button from "@/components/atoms/Button";

const AttendanceTable = ({ 
  students, 
  attendanceRecords, 
  onAttendanceChange,
  onStudentClick,
  selectedDate,
  selectedClass 
}) => {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getAttendanceStatus = (studentId) => {
    const record = attendanceRecords.find(
      record => record.studentId === studentId && 
      new Date(record.date).toDateString() === selectedDate.toDateString() &&
      record.classId === selectedClass?.Id
    );
    return record?.status || null;
  };

  const sortedStudents = [...students].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const markAllPresent = () => {
    students.forEach(student => {
      if (!getAttendanceStatus(student.Id)) {
        onAttendanceChange(student.Id, "present");
      }
    });
  };

  const SortHeader = ({ field, children }) => (
    <th 
      className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-2">
        <span>{children}</span>
        <div className="flex flex-col">
          <ApperIcon 
            name="ChevronUp" 
            className={`h-3 w-3 ${
              sortField === field && sortDirection === "asc" 
                ? "text-primary-600" 
                : "text-gray-400"
            }`} 
          />
          <ApperIcon 
            name="ChevronDown" 
            className={`h-3 w-3 -mt-1 ${
              sortField === field && sortDirection === "desc" 
                ? "text-primary-600" 
                : "text-gray-400"
            }`} 
          />
        </div>
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-accent-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            Student Attendance
          </h3>
          <Button
            size="sm"
            variant="success"
            onClick={markAllPresent}
            className="text-xs"
          >
            <ApperIcon name="CheckCheck" className="h-4 w-4 mr-1" />
            Mark All Present
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <SortHeader field="name">Student Name</SortHeader>
              <SortHeader field="Id">Student ID</SortHeader>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedStudents.map((student, index) => {
              const status = getAttendanceStatus(student.Id);
              return (
<tr 
                  key={student.Id} 
                  className={`
                    hover:bg-blue-50 transition-colors duration-200 cursor-pointer
                    ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                  `}
                  onClick={() => onStudentClick?.(student)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-sm font-bold text-primary-700">
                          {student.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">
                    {student.Id}
                  </td>
                  <td className="px-6 py-4">
                    <AttendanceStatus 
                      status={status} 
                      compact={true}
                    />
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <AttendanceStatus 
                      status={status}
                      onStatusChange={onAttendanceChange}
                      studentId={student.Id}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;