import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Settings, Sliders } from "lucide-react";
import { UserGoal } from "@/lib/types";

interface NutritionGoalsSettingsProps {
  userId: number;
}

const NutritionGoalsSettings = ({ userId }: NutritionGoalsSettingsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [calorieGoal, setCalorieGoal] = useState<number>(2000);
  const [proteinGoal, setProteinGoal] = useState<number>(120);
  const [carbsGoal, setCarbsGoal] = useState<number>(250);
  const [fatGoal, setFatGoal] = useState<number>(65);
  const [waterGoal, setWaterGoal] = useState<number>(2000);
  
  // Fetch existing goals
  const { data: userGoals, isLoading } = useQuery<UserGoal>({
    queryKey: [`/api/user-goals/${userId}`],
    enabled: !!userId,
  });
  
  // Update state with existing goals when data is fetched
  useEffect(() => {
    if (userGoals) {
      setCalorieGoal(userGoals.calorieGoal || 2000);
      setProteinGoal(userGoals.proteinGoal || 120);
      setCarbsGoal(userGoals.carbsGoal || 250);
      setFatGoal(userGoals.fatGoal || 65);
      setWaterGoal(userGoals.waterGoal || 2000);
    }
  }, [userGoals]);
  
  // Save nutrition goals
  const updateGoalsMutation = useMutation({
    mutationFn: async (goalData: Partial<UserGoal>) => {
      const response = await apiRequest(
        "PATCH", 
        `/api/user-goals/${userId}`, 
        goalData
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user-goals/${userId}`] });
      toast({
        title: "Goals updated",
        description: "Your nutrition goals have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update goals",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData = {
      userId,
      calorieGoal,
      proteinGoal,
      carbsGoal,
      fatGoal,
      waterGoal
    };
    
    updateGoalsMutation.mutate(goalData);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading your nutrition goals...</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Sliders className="h-5 w-5" />
          Nutrition Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="calorieGoal">Daily Calorie Goal (kcal)</Label>
            <Input
              id="calorieGoal"
              type="number"
              value={calorieGoal}
              onChange={(e) => setCalorieGoal(Number(e.target.value))}
              min="500"
              step="50"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="proteinGoal">Protein Goal (g)</Label>
              <Input
                id="proteinGoal"
                type="number"
                value={proteinGoal}
                onChange={(e) => setProteinGoal(Number(e.target.value))}
                min="0"
                step="5"
              />
            </div>
            
            <div>
              <Label htmlFor="carbsGoal">Carbs Goal (g)</Label>
              <Input
                id="carbsGoal"
                type="number"
                value={carbsGoal}
                onChange={(e) => setCarbsGoal(Number(e.target.value))}
                min="0"
                step="5"
              />
            </div>
            
            <div>
              <Label htmlFor="fatGoal">Fat Goal (g)</Label>
              <Input
                id="fatGoal"
                type="number"
                value={fatGoal}
                onChange={(e) => setFatGoal(Number(e.target.value))}
                min="0"
                step="5"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="waterGoal">Daily Water Goal (ml)</Label>
            <Input
              id="waterGoal"
              type="number"
              value={waterGoal}
              onChange={(e) => setWaterGoal(Number(e.target.value))}
              min="0"
              step="100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 2000-3000 ml per day
            </p>
          </div>
          
          <div className="flex justify-between pt-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                setCalorieGoal(2000);
                setProteinGoal(120);
                setCarbsGoal(250);
                setFatGoal(65);
                setWaterGoal(2000);
              }}
            >
              Reset to Default
            </Button>
            
            <Button 
              type="submit"
              disabled={updateGoalsMutation.isPending}
            >
              {updateGoalsMutation.isPending ? "Saving..." : "Save Goals"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NutritionGoalsSettings;