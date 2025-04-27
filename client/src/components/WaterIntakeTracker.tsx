import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplet, Plus, Minus, RotateCcw } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface WaterIntakeTrackerProps {
  userId: number;
  date: string;
}

interface WaterIntake {
  id?: number;
  userId: number;
  date: string;
  amount: number;
  goal: number;
}

const WaterIntakeTracker = ({ userId, date }: WaterIntakeTrackerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [waterAmount, setWaterAmount] = useState<number>(0);
  const [waterGoal, setWaterGoal] = useState<number>(2000); // Default goal: 2000 ml (2 liters)
  const [customAmount, setCustomAmount] = useState<string>('');
  const [customUnit, setCustomUnit] = useState<'ml' | 'L'>('ml');
  
  // Fetch water intake data
  const { data: waterIntakeData, isLoading } = useQuery<WaterIntake | null>({
    queryKey: [`/api/water-intake?userId=${userId}&date=${date}`],
    enabled: !!userId && !!date
  });
  
  // Update states when data is fetched
  useEffect(() => {
    if (waterIntakeData) {
      setWaterAmount(waterIntakeData.amount || 0);
      setWaterGoal(waterIntakeData.goal || 2000);
    }
  }, [waterIntakeData]);
  
  // Calculate percentage for progress bar
  const waterPercentage = Math.min(Math.round((waterAmount / waterGoal) * 100), 100);
  
  // Format display values
  const formatWaterDisplay = (amount: number) => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}L`;
    }
    return `${amount}ml`;
  };

  // Water goal in liters
  const waterGoalInLiters = (waterGoal / 1000).toFixed(1);
  
  // Save water intake data
  const saveWaterMutation = useMutation({
    mutationFn: async (waterData: WaterIntake) => {
      const response = await apiRequest(
        waterIntakeData?.id ? "PATCH" : "POST",
        waterIntakeData?.id ? `/api/water-intake/${waterIntakeData.id}` : "/api/water-intake",
        waterData
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/water-intake?userId=${userId}&date=${date}`] });
      toast({
        title: "Water intake updated",
        description: "Your water intake has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update water intake",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
  
  // Handle water amount changes
  const updateWaterAmount = (amount: number) => {
    // Ensure we don't go negative
    const newAmount = Math.max(0, amount);
    setWaterAmount(newAmount);
    
    // Save water intake data
    saveWaterMutation.mutate({
      userId,
      date,
      amount: newAmount,
      goal: waterGoal
    });
  };
  
  // Quick add buttons
  const addWater = (ml: number) => {
    updateWaterAmount(waterAmount + ml);
  };

  // Update water goal
  const updateWaterGoal = (newGoal: number) => {
    setWaterGoal(newGoal);
    
    saveWaterMutation.mutate({
      userId,
      date,
      amount: waterAmount,
      goal: newGoal
    });
  };

  // Handle custom amount input
  const handleCustomAmountSubmit = () => {
    const parsedAmount = parseFloat(customAmount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      // Convert to milliliters if needed
      const amountInMl = customUnit === 'L' ? parsedAmount * 1000 : parsedAmount;
      updateWaterAmount(waterAmount + amountInMl);
      setCustomAmount('');
    }
  };
  
  return (
    <Card className="mb-4 md:mb-6">
      <CardHeader className={`pb-1 md:pb-2 ${isMobile ? 'px-3 py-3' : ''}`}>
        <CardTitle className="text-lg flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blue-500" />
          Water Intake
        </CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? 'px-3 py-2' : ''}>
        <div className="mb-3 text-center">
          <span className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-blue-500`}>
            {formatWaterDisplay(waterAmount)}
          </span>
          <span className="text-md font-medium text-gray-500"> / {waterGoalInLiters}L</span>
        </div>
        
        <Progress value={waterPercentage} className="h-2 mb-4" />
        
        <div className="space-y-3 md:space-y-4">
          {/* Water buttons - 3 in a row on mobile, 2 in a row on desktop */}
          {isMobile ? (
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 h-12 touch-manipulation"
                onClick={() => addWater(250)}
              >
                +250ml
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 h-12 touch-manipulation"
                onClick={() => addWater(500)}
              >
                +500ml
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 h-12 touch-manipulation"
                onClick={() => addWater(1000)}
              >
                +1L
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-orange-600 border-orange-200 hover:bg-orange-50 h-12 touch-manipulation col-span-3"
                onClick={() => updateWaterAmount(0)}
              >
                Reset
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => addWater(250)}
                >
                  + 250ml
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => addWater(500)}
                >
                  + 500ml
                </Button>
              </div>
              
              <div className="flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => addWater(1000)}
                >
                  + 1L
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-orange-600 border-orange-200 hover:bg-orange-50"
                  onClick={() => updateWaterAmount(0)}
                >
                  Reset
                </Button>
              </div>
            </>
          )}

          <div className={`flex items-end gap-2 ${isMobile ? 'pt-2' : 'pt-4'}`}>
            <div className="w-full">
              <Label htmlFor="customAmount" className="text-sm font-medium mb-1 block">
                Add custom amount
              </Label>
              <div className="flex">
                <Input
                  id="customAmount"
                  type="number"
                  inputMode="decimal"
                  placeholder="Amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="rounded-r-none"
                />
                <Select
                  value={customUnit}
                  onValueChange={(value) => setCustomUnit(value as 'ml' | 'L')}
                >
                  <SelectTrigger className={`${isMobile ? 'w-16' : 'w-24'} rounded-l-none`}>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={handleCustomAmountSubmit}
              disabled={!customAmount || parseFloat(customAmount) <= 0}
              className="touch-manipulation"
            >
              Add
            </Button>
          </div>
          
          <div className={isMobile ? 'pt-1' : 'pt-2'}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Today's Intake</span>
              <span className="text-sm text-gray-500">{formatWaterDisplay(waterAmount)}</span>
            </div>
            <Slider
              defaultValue={[0]}
              value={[waterAmount]}
              max={waterGoal * 1.5}
              step={50}
              onValueChange={(values) => setWaterAmount(values[0])}
              onValueCommit={(values) => updateWaterAmount(values[0])}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterIntakeTracker;