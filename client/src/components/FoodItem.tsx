import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FoodItem as FoodItemType } from "@/lib/types";

interface FoodItemProps {
  item: FoodItemType;
}

const FoodItem = ({ item }: FoodItemProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/food-items/${item.id}`);
    },
    onSuccess: () => {
      // Invalidate and refetch all queries that might be affected by this deletion
      queryClient.invalidateQueries({ queryKey: [`/api/food-items?userId=${item.userId}&date=${item.date}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/food-items/meal?userId=${item.userId}&date=${item.date}&mealType=${item.mealType}`] });
      
      toast({
        title: "Food item deleted",
        description: "The food item has been removed from your log.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete food item",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
      <div>
        <div className="font-medium">{item.foodName}</div>
        <div className="text-sm text-gray-500">{item.quantity} {item.unit}</div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="font-medium">{Math.round(item.calories)} cal</div>
          <div className="text-xs text-gray-500">
            {Math.round(item.protein)}g P | {Math.round(item.carbs)}g C | {Math.round(item.fat)}g F
          </div>
        </div>
        <button 
          className="text-gray-400 hover:text-red-500"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default FoodItem;
