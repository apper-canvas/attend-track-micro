import { format } from "date-fns";
import Input from "@/components/atoms/Input";

const DatePicker = ({ 
  value, 
  onChange, 
  className = "",
  label = "Date"
}) => {
  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    onChange(selectedDate);
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Input
        type="date"
        value={formatDateForInput(value)}
        onChange={handleDateChange}
        className="w-full"
      />
    </div>
  );
};

export default DatePicker;