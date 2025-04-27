import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarSidebarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const CalendarSidebar = ({ selectedDate, onDateChange }: CalendarSidebarProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate);

  const handleMonthChange = (increment: boolean) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + (increment ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Calendar</CardTitle>
          <div className="flex items-center space-x-1">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => handleMonthChange(false)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => handleMonthChange(true)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {format(currentMonth, 'MMMM yyyy')}
        </p>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateChange(date)}
          month={currentMonth}
          className="rounded-md border"
        />
        <div className="mt-4 text-center">
          <p className="text-sm font-medium">Selected Date</p>
          <p className="text-lg font-bold text-primary">
            {format(selectedDate, 'MMMM d, yyyy')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarSidebar;