// Type definitions for food items and user data

export interface FoodItem {
  id: number;
  userId: number;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: string;
  date: string;
  fdcId?: string;
}

export interface UserGoal {
  id: number;
  userId: number;
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  waterGoal?: number;
}

export interface DailyTotal {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealData {
  calories: number;
  items: FoodItem[];
}

export interface MealSummary {
  breakfast: MealData;
  lunch: MealData;
  dinner: MealData;
  snack: MealData;
}

export interface IndianFood {
  id: number;
  foodCode?: string;
  foodName: string;
  foodGroup?: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  calcium?: number;
  iron?: number;
}

export interface CustomFood {
  id: number;
  userId: number;
  foodName: string;
  foodGroup?: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  servingSize: number;
  servingUnit: string;
  createdAt?: string;
}

export interface WaterIntake {
  id?: number;
  userId: number;
  date: string;
  amount: number;
  goal: number;
}
