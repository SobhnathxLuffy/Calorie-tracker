import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CustomFood } from "@/lib/types";
import { Database, Search, Trash2 } from "lucide-react";

interface CustomFoodsListProps {
  userId: number;
}

const CustomFoodsList = ({ userId }: CustomFoodsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch custom foods
  const { data: customFoods, isLoading } = useQuery<CustomFood[]>({
    queryKey: [`/api/custom-foods?userId=${userId}`],
    enabled: !!userId,
  });
  
  // Delete custom food
  const deleteFoodMutation = useMutation({
    mutationFn: async (foodId: number) => {
      const response = await apiRequest("DELETE", `/api/custom-foods/${foodId}`, null);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/custom-foods?userId=${userId}`] });
      toast({
        title: "Food deleted",
        description: "The custom food has been removed from your database.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete food",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
  
  // Handle delete button click
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this custom food?")) {
      deleteFoodMutation.mutate(id);
    }
  };
  
  // Filter foods based on search query
  const filteredFoods = customFoods?.filter(food => 
    food.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (food.foodGroup && food.foodGroup.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Database className="h-5 w-5" />
          My Custom Foods
        </CardTitle>
        <CardDescription>
          Your custom food database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your custom foods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        {isLoading ? (
          <p className="text-center py-4">Loading your custom foods...</p>
        ) : !filteredFoods || filteredFoods.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            {searchQuery ? "No foods match your search" : "You haven't added any custom foods yet"}
          </p>
        ) : (
          <div className="space-y-2 mt-2">
            {filteredFoods.map((food) => (
              <div 
                key={food.id} 
                className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{food.foodName}</p>
                  <div className="text-sm text-gray-500 flex flex-wrap gap-x-4">
                    <span>{food.calories} kcal</span>
                    <span>{food.protein}g protein</span>
                    <span>{food.carbs}g carbs</span>
                    <span>{food.fat}g fat</span>
                  </div>
                  {food.foodGroup && (
                    <p className="text-xs text-gray-400 mt-1">{food.foodGroup}</p>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(food.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomFoodsList;