import attendanceData from "@/services/mockData/attendanceRecords.json";

let attendanceRecords = [...attendanceData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  async getAll() {
    await delay(350);
    return [...attendanceRecords];
  },

  async getById(id) {
    await delay(200);
    const record = attendanceRecords.find(r => r.Id === parseInt(id));
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  },

  async create(recordData) {
    await delay(400);
    const maxId = Math.max(...attendanceRecords.map(r => r.Id), 0);
    const newRecord = {
      Id: maxId + 1,
      ...recordData,
      markedAt: recordData.markedAt || new Date().toISOString()
    };
    attendanceRecords.push(newRecord);
    return { ...newRecord };
  },

  async update(id, recordData) {
    await delay(350);
    const index = attendanceRecords.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    attendanceRecords[index] = { 
      ...attendanceRecords[index], 
      ...recordData, 
      Id: parseInt(id),
      markedAt: new Date().toISOString()
    };
    return { ...attendanceRecords[index] };
  },

  async delete(id) {
    await delay(250);
    const index = attendanceRecords.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    attendanceRecords.splice(index, 1);
    return { success: true };
  },

  async getByClassAndDate(classId, date) {
    await delay(300);
    const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
    return attendanceRecords.filter(record => 
      record.classId === parseInt(classId) && 
      record.date.startsWith(dateStr)
    );
  },

  async getByStudentId(studentId) {
    await delay(300);
    return attendanceRecords.filter(record => 
      record.studentId === parseInt(studentId)
    );
  },

  async getByDateRange(startDate, endDate) {
    await delay(400);
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    return attendanceRecords.filter(record => {
      const recordDate = new Date(record.date).getTime();
      return recordDate >= start && recordDate <= end;
    });
  },

  async bulkCreate(records) {
    await delay(500);
    const maxId = Math.max(...attendanceRecords.map(r => r.Id), 0);
    
    const newRecords = records.map((record, index) => ({
      Id: maxId + index + 1,
      ...record,
      markedAt: record.markedAt || new Date().toISOString()
    }));
    
    attendanceRecords.push(...newRecords);
    return [...newRecords];
  },

  async getStatsByClass(classId) {
    await delay(300);
    const classRecords = attendanceRecords.filter(r => r.classId === parseInt(classId));
    
    const stats = {
      totalRecords: classRecords.length,
      presentCount: classRecords.filter(r => r.status === "present").length,
      absentCount: classRecords.filter(r => r.status === "absent").length,
      lateCount: classRecords.filter(r => r.status === "late").length,
      excusedCount: classRecords.filter(r => r.status === "excused").length
    };
    
    stats.attendanceRate = stats.totalRecords > 0 ? 
      ((stats.presentCount + stats.lateCount) / stats.totalRecords * 100) : 0;
    
    return stats;
  }
};