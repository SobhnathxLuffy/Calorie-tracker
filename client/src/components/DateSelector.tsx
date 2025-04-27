import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DateSelectorProps {
  date: Date;
  setDate: (date: Date) => void;
}

const DateSelector = ({ date, setDate }: DateSelectorProps) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrevDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    setDate(newDate);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={handlePrevDay}
            className="text-gray-500 hover:text-primary transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">
            {formatDate(date)}
          </h2>
          <button 
            onClick={handleNextDay}
            className="text-gray-500 hover:text-primary transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateSelector;
