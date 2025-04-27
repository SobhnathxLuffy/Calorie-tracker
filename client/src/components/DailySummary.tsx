import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { FoodItem, UserGoal } from "@/lib/types";

interface DailySummaryProps {
  date: string;
  userId: number;
}

const DailySummary = ({ date, userId }: DailySummaryProps) => {
  const { data: foodItems = [] } = useQuery<FoodItem[]>({
    queryKey: [`/api/food-items?userId=${userId}&date=${date}`],
  });

  const { data: userGoals } = useQuery<UserGoal>({
    queryKey: [`/api/user-goals/${userId}`],
  });

  // Calculate daily totals
  const dailyTotal = foodItems.reduce(
    (acc, item) => {
      acc.calories += item.calories;
      acc.protein += item.protein;
      acc.carbs += item.carbs;
      acc.fat += item.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Calculate progress percentages
  const caloriePercentage = userGoals ? Math.min(100, (dailyTotal.calories / userGoals.calorieGoal) * 100) : 0;
  const proteinPercentage = userGoals ? Math.min(100, (dailyTotal.protein / userGoals.proteinGoal) * 100) : 0;
  const carbsPercentage = userGoals ? Math.min(100, (dailyTotal.carbs / userGoals.carbsGoal) * 100) : 0;
  const fatPercentage = userGoals ? Math.min(100, (dailyTotal.fat / userGoals.fatGoal) * 100) : 0;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-primary-dark">Daily Summary</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Calories */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
            <span className="text-gray-500 text-sm font-medium">Calories</span>
            <span className="text-3xl font-bold text-primary">{Math.round(dailyTotal.calories)}</span>
            <span className="text-xs text-gray-500 mt-1">Goal: {userGoals?.calorieGoal || 0}</span>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-primary h-1.5 rounded-full" 
                style={{ width: `${caloriePercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Protein */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
            <span className="text-gray-500 text-sm font-medium">Protein</span>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-primary">{Math.round(dailyTotal.protein)}</span>
              <span className="text-lg font-medium ml-1">g</span>
            </div>
            <span className="text-xs text-gray-500 mt-1">Goal: {userGoals?.proteinGoal || 0}g</span>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-primary h-1.5 rounded-full" 
                style={{ width: `${proteinPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Carbs */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
            <span className="text-gray-500 text-sm font-medium">Carbs</span>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-primary">{Math.round(dailyTotal.carbs)}</span>
              <span className="text-lg font-medium ml-1">g</span>
            </div>
            <span className="text-xs text-gray-500 mt-1">Goal: {userGoals?.carbsGoal || 0}g</span>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-primary h-1.5 rounded-full" 
                style={{ width: `${carbsPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Fat */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
            <span className="text-gray-500 text-sm font-medium">Fat</span>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-primary">{Math.round(dailyTotal.fat)}</span>
              <span className="text-lg font-medium ml-1">g</span>
            </div>
            <span className="text-xs text-gray-500 mt-1">Goal: {userGoals?.fatGoal || 0}g</span>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-primary h-1.5 rounded-full" 
                style={{ width: `${fatPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailySummary;
