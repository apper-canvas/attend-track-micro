import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import AttendanceTable from "@/components/organisms/AttendanceTable";
import AttendanceSummary from "@/components/organisms/AttendanceSummary";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { attendanceService } from "@/services/api/attendanceService";

const AttendancePage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, classesData, attendanceData] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        attendanceService.getAll()
      ]);
      
      setStudents(studentsData);
      setClasses(classesData);
      setAttendanceRecords(attendanceData);
      setFilteredStudents(studentsData);
      
      // Auto-select first class if none selected
      if (classesData.length > 0 && !selectedClass) {
        setSelectedClass(classesData[0]);
      }
    } catch (err) {
      setError("Failed to load attendance data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, selectedClass, searchTerm]);

  const filterStudents = () => {
    let filtered = students;
    
    // Filter by selected class
    if (selectedClass) {
      filtered = filtered.filter(student => 
        selectedClass.studentIds.includes(student.Id)
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.Id.toString().includes(searchTerm)
      );
    }
    
    setFilteredStudents(filtered);
  };

  const handleAttendanceChange = async (studentId, status) => {
    try {
      if (!selectedClass) {
        toast.error("Please select a class first");
        return;
      }

      const existingRecord = attendanceRecords.find(
        record => 
          record.studentId === studentId && 
          new Date(record.date).toDateString() === selectedDate.toDateString() &&
          record.classId === selectedClass.Id
      );

      if (existingRecord) {
        // Update existing record
        const updatedRecord = await attendanceService.update(existingRecord.Id, {
          ...existingRecord,
          status,
          markedAt: new Date()
        });
        
        setAttendanceRecords(prev => 
          prev.map(record => 
            record.Id === existingRecord.Id ? updatedRecord : record
          )
        );
      } else {
        // Create new record
        const newRecord = await attendanceService.create({
          studentId,
          classId: selectedClass.Id,
          date: selectedDate,
          status,
          note: "",
          markedAt: new Date()
        });
        
        setAttendanceRecords(prev => [...prev, newRecord]);
      }

      toast.success("Attendance updated successfully");
    } catch (err) {
      toast.error("Failed to update attendance");
      console.error("Error updating attendance:", err);
    }
  };

  const handleExport = (type) => {
    try {
      let data = [];
      let filename = "";

      if (type === "today") {
        const todayRecords = attendanceRecords.filter(
          record => 
            new Date(record.date).toDateString() === selectedDate.toDateString() &&
            record.classId === selectedClass?.Id
        );

        data = filteredStudents.map(student => {
          const record = todayRecords.find(r => r.studentId === student.Id);
          return {
            "Student Name": student.name,
            "Student ID": student.Id,
            "Email": student.email,
            "Status": record?.status || "Not Marked",
            "Date": format(selectedDate, "yyyy-MM-dd"),
            "Class": selectedClass?.name || ""
          };
        });
        
        filename = `attendance-${format(selectedDate, "yyyy-MM-dd")}-${selectedClass?.name || "class"}.csv`;
      } else if (type === "class") {
        const classRecords = attendanceRecords.filter(r => r.classId === selectedClass?.Id);
        
        data = classRecords.map(record => {
          const student = students.find(s => s.Id === record.studentId);
          return {
            "Student Name": student?.name || "Unknown",
            "Student ID": record.studentId,
            "Date": format(new Date(record.date), "yyyy-MM-dd"),
            "Status": record.status,
            "Marked At": format(new Date(record.markedAt), "yyyy-MM-dd HH:mm:ss"),
            "Note": record.note || ""
          };
        });
        
        filename = `attendance-history-${selectedClass?.name || "class"}.csv`;
      }

      if (data.length === 0) {
        toast.warning("No data to export");
        return;
      }

      // Convert to CSV
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(","),
        ...data.map(row => headers.map(header => `"${row[header]}"`).join(","))
      ].join("\n");

      // Download file
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Data exported successfully");
    } catch (err) {
      toast.error("Failed to export data");
      console.error("Error exporting data:", err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error 
        title="Unable to Load Attendance Data"
        message={error}
        onRetry={loadData}
      />
    );
  }

  if (!selectedClass) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          classes={classes}
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Empty
            icon="BookOpen"
            title="No Class Selected"
            message="Please select a class to begin tracking attendance."
            actionLabel="Select Class Above"
          />
        </div>
      </div>
    );
  }

  if (filteredStudents.length === 0 && searchTerm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          classes={classes}
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <SearchBar 
              onSearch={setSearchTerm}
              placeholder="Search students by name, email, or ID..."
            />
          </div>
          <Empty
            icon="Search"
            title="No Students Found"
            message={`No students match "${searchTerm}". Try adjusting your search terms.`}
          />
        </div>
      </div>
    );
  }

  if (filteredStudents.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          classes={classes}
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Empty
            icon="Users"
            title="No Students in This Class"
            message="This class doesn't have any enrolled students yet."
            actionLabel="Manage Class Roster"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        classes={classes}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <SearchBar 
              onSearch={setSearchTerm}
              placeholder="Search students by name, email, or ID..."
            />
            
            <AttendanceTable
              students={filteredStudents}
              attendanceRecords={attendanceRecords}
              onAttendanceChange={handleAttendanceChange}
              selectedDate={selectedDate}
              selectedClass={selectedClass}
            />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AttendanceSummary
              students={filteredStudents}
              attendanceRecords={attendanceRecords}
              selectedDate={selectedDate}
              selectedClass={selectedClass}
              onExport={handleExport}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;