import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const ClassSelector = ({ 
  classes, 
  selectedClass, 
  onClassChange, 
  className = "" 
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Class
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <ApperIcon name="BookOpen" className="h-4 w-4 text-gray-400" />
        </div>
        <Select
          value={selectedClass?.Id || ""}
          onChange={(e) => {
            const classId = parseInt(e.target.value);
            const selected = classes.find(c => c.Id === classId);
            onClassChange(selected);
          }}
          className="pl-10"
        >
          <option value="">Choose a class...</option>
          {classes.map((classItem) => (
            <option key={classItem.Id} value={classItem.Id}>
              {classItem.name} ({classItem.schedule})
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default ClassSelector;