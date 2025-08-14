import classesData from "@/services/mockData/classes.json";

let classes = [...classesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const classService = {
  async getAll() {
    await delay(250);
    return [...classes];
  },

  async getById(id) {
    await delay(200);
    const classItem = classes.find(c => c.Id === parseInt(id));
    if (!classItem) {
      throw new Error("Class not found");
    }
    return { ...classItem };
  },

  async create(classData) {
    await delay(400);
    const maxId = Math.max(...classes.map(c => c.Id), 0);
    const newClass = {
      Id: maxId + 1,
      ...classData,
      studentIds: classData.studentIds || []
    };
    classes.push(newClass);
    return { ...newClass };
  },

  async update(id, classData) {
    await delay(350);
    const index = classes.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Class not found");
    }
    classes[index] = { ...classes[index], ...classData, Id: parseInt(id) };
    return { ...classes[index] };
  },

  async delete(id) {
    await delay(250);
    const index = classes.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Class not found");
    }
    classes.splice(index, 1);
    return { success: true };
  },

  async addStudent(classId, studentId) {
    await delay(300);
    const classIndex = classes.findIndex(c => c.Id === parseInt(classId));
    if (classIndex === -1) {
      throw new Error("Class not found");
    }
    
    const studentIds = classes[classIndex].studentIds;
    if (!studentIds.includes(parseInt(studentId))) {
      studentIds.push(parseInt(studentId));
    }
    
    return { ...classes[classIndex] };
  },

  async removeStudent(classId, studentId) {
    await delay(300);
    const classIndex = classes.findIndex(c => c.Id === parseInt(classId));
    if (classIndex === -1) {
      throw new Error("Class not found");
    }
    
    const studentIds = classes[classIndex].studentIds;
    const studentIndex = studentIds.indexOf(parseInt(studentId));
    if (studentIndex > -1) {
      studentIds.splice(studentIndex, 1);
    }
    
    return { ...classes[classIndex] };
  }
};