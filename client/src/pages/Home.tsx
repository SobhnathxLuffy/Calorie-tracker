import { useState } from "react";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import DateSelector from "@/components/DateSelector";
import DailySummary from "@/components/DailySummary";
import TrackFoodForm from "@/components/TrackFoodForm";
import MealSection from "@/components/MealSection";
import CalendarSidebar from "@/components/CalendarSidebar";
import WaterIntakeTracker from "@/components/WaterIntakeTracker";

const Home = () => {
  const [date, setDate] = useState<Date>(new Date());
  // In a real app, userId would come from authentication
  const userId = 1;

  // Format date for API requests (YYYY-MM-DD)
  const formattedDate = date.toISOString().split('T')[0];

  const scrollToFoodForm = () => {
    const trackFoodCard = document.querySelector('.bg-white:nth-child(3)');
    trackFoodCard?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto p-4 pb-24 md:pt-8">
      <Header />
      <div className="hidden md:block mb-4">
        <DateSelector date={date} setDate={setDate} />
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="md:hidden mb-4">
            <DateSelector date={date} setDate={setDate} />
          </div>
          
          <DailySummary date={formattedDate} userId={userId} />
          <TrackFoodForm userId={userId} date={formattedDate} />
          
          <div className="space-y-6">
            <MealSection 
              title="Breakfast" 
              mealType="breakfast" 
              userId={userId} 
              date={formattedDate} 
            />
            <MealSection 
              title="Lunch" 
              mealType="lunch" 
              userId={userId} 
              date={formattedDate} 
            />
            <MealSection 
              title="Dinner" 
              mealType="dinner" 
              userId={userId} 
              date={formattedDate} 
            />
            <MealSection 
              title="Snacks" 
              mealType="snack" 
              userId={userId} 
              date={formattedDate} 
            />
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-full lg:w-1/3 space-y-6">
          <CalendarSidebar selectedDate={date} onDateChange={setDate} />
          <WaterIntakeTracker userId={userId} date={formattedDate} />
        </div>
      </div>
      
      {/* Floating Action Button for Mobile */}
      <button 
        className="fixed bottom-6 right-6 bg-primary hover:bg-primary-dark text-white rounded-full p-4 shadow-lg transition md:hidden"
        onClick={scrollToFoodForm}
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Home;
