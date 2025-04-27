import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { FoodItem as FoodItemType } from "@/lib/types";
import FoodItemComponent from "./FoodItem";

interface MealSectionProps {
  title: string;
  mealType: string;
  userId: number;
  date: string;
}

const MealSection = ({ title, mealType, userId, date }: MealSectionProps) => {
  const { data: foodItems = [], isLoading } = useQuery<FoodItemType[]>({
    queryKey: [`/api/food-items/meal?userId=${userId}&date=${date}&mealType=${mealType}`],
  });

  // Calculate total calories for this meal
  const totalCalories = foodItems.reduce((acc, item) => acc + item.calories, 0);

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-primary-dark">{title}</h2>
          <div className="text-sm text-gray-500">
            <span>{Math.round(totalCalories)}</span> cal
          </div>
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            <div className="py-4 text-center text-gray-500">Loading...</div>
          ) : foodItems.length > 0 ? (
            foodItems.map((item) => (
              <FoodItemComponent key={item.id} item={item} />
            ))
          ) : (
            <div className="text-center py-6 text-gray-400">
              <p>No {title.toLowerCase()} items added yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MealSection;
