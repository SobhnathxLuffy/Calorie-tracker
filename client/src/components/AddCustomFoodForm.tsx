import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PlusCircle } from "lucide-react";

interface AddCustomFoodFormProps {
  userId: number;
  onSuccess?: () => void;
}

const AddCustomFoodForm = ({ userId, onSuccess }: AddCustomFoodFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [fiber, setFiber] = useState<number>(0);
  const [servingSize, setServingSize] = useState<number>(100);
  const [servingUnit, setServingUnit] = useState<string>("g");
  const [foodGroup, setFoodGroup] = useState<string>("Custom Foods");
  
  const addCustomFoodMutation = useMutation({
    mutationFn: async (customFood: any) => {
      const response = await apiRequest("POST", "/api/custom-foods", customFood);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [`/api/custom-foods?userId=${userId}`] });
      
      // Reset form
      setFoodName("");
      setCalories(0);
      setProtein(0);
      setCarbs(0);
      setFat(0);
      setFiber(0);
      setServingSize(100);
      
      toast({
        title: "Custom food added",
        description: "Your custom food has been added to your database.",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to add custom food",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foodName) {
      toast({
        title: "Food name required",
        description: "Please enter a name for your custom food.",
        variant: "destructive",
      });
      return;
    }
    
    // Create and submit custom food object
    const customFood = {
      userId,
      foodName,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      servingSize,
      servingUnit,
      foodGroup
    };
    
    addCustomFoodMutation.mutate(customFood);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Add Custom Food
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="foodName">Food Name</Label>
            <Input
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g., Homemade Granola"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="calories">Calories (kcal)</Label>
              <Input
                id="calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                min="0"
              />
            </div>
            
            <div>
              <Label htmlFor="servingSize">Serving Size</Label>
              <div className="flex space-x-2">
                <Input
                  id="servingSize"
                  type="number"
                  value={servingSize}
                  onChange={(e) => setServingSize(Number(e.target.value))}
                  min="0"
                  className="w-2/3"
                />
                <Select value={servingUnit} onValueChange={setServingUnit}>
                  <SelectTrigger className="w-1/3">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="oz">oz</SelectItem>
                    <SelectItem value="serving">serving</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
                min="0"
                step="0.1"
              />
            </div>
            
            <div>
              <Label htmlFor="carbs">Carbohydrates (g)</Label>
              <Input
                id="carbs"
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(Number(e.target.value))}
                min="0"
                step="0.1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                value={fat}
                onChange={(e) => setFat(Number(e.target.value))}
                min="0"
                step="0.1"
              />
            </div>
            
            <div>
              <Label htmlFor="fiber">Fiber (g)</Label>
              <Input
                id="fiber"
                type="number"
                value={fiber}
                onChange={(e) => setFiber(Number(e.target.value))}
                min="0"
                step="0.1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="foodGroup">Food Group (optional)</Label>
            <Input
              id="foodGroup"
              value={foodGroup}
              onChange={(e) => setFoodGroup(e.target.value)}
              placeholder="e.g., Breakfast Foods, Snacks, etc."
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={addCustomFoodMutation.isPending}
          >
            {addCustomFoodMutation.isPending ? "Adding..." : "Add Custom Food"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCustomFoodForm;