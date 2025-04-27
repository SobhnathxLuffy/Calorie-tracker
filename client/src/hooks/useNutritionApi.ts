import { useState, useCallback } from 'react';
import { searchFoods as searchFoodsApi, searchIndianFoods } from '@/lib/api';
import { IndianFood } from '@/lib/types';

// Helper to convert Indian food to the FoodSearchResult format
const convertIndianFoodToSearchResult = (food: IndianFood) => {
  if (!food) {
    console.error("Invalid Indian food data:", food);
    return {
      fdcId: "invalid-food",
      description: "Invalid food data",
      nutrients: [],
      isIndianFood: true
    };
  }
  
  return {
    fdcId: `indian-${food.id}`, // Prefix to identify as Indian food
    description: food.foodName || "Unknown Indian Food",
    nutrients: [
      {
        nutrientId: 1008, // Energy (kcal)
        nutrientName: "Energy",
        nutrientNumber: "208",
        unitName: "kcal",
        value: food.calories || 0
      },
      {
        nutrientId: 1003, // Protein
        nutrientName: "Protein",
        nutrientNumber: "203",
        unitName: "g",
        value: food.protein || 0
      },
      {
        nutrientId: 1005, // Carbs
        nutrientName: "Carbohydrates",
        nutrientNumber: "205",
        unitName: "g",
        value: food.carbs || 0
      },
      {
        nutrientId: 1004, // Fat
        nutrientName: "Total lipid (fat)",
        nutrientNumber: "204",
        unitName: "g",
        value: food.fat || 0
      },
      {
        nutrientId: 1079, // Fiber
        nutrientName: "Fiber",
        nutrientNumber: "291",
        unitName: "g",
        value: food.fiber || 0
      },
      {
        nutrientId: 1087, // Calcium
        nutrientName: "Calcium",
        nutrientNumber: "301",
        unitName: "mg",
        value: food.calcium || 0
      },
      {
        nutrientId: 1089, // Iron
        nutrientName: "Iron",
        nutrientNumber: "303",
        unitName: "mg",
        value: food.iron || 0
      }
    ],
    foodGroup: food.foodGroup || "Indian Foods",
    foodCode: food.foodCode,
    isIndianFood: true
  };
};

export const useNutritionApi = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingIndian, setIsSearchingIndian] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchFoods = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      return [];
    }

    setIsSearching(true);
    setError(null);

    try {
      const results = await searchFoodsApi(query);
      return results;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  const searchIndianFoodsWithFormat = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      return [];
    }

    setIsSearchingIndian(true);
    setError(null);

    try {
      const results = await searchIndianFoods(query);
      return results.map(convertIndianFoodToSearchResult);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to search Indian foods');
      setError(error);
      return [];
    } finally {
      setIsSearchingIndian(false);
    }
  }, []);

  // Combined search function
  const searchAllFoods = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      return [];
    }

    setIsSearching(true);
    setError(null);

    try {
      // Search both APIs in parallel
      const [usda, indian] = await Promise.all([
        searchFoodsApi(query).catch(() => []),
        searchIndianFoods(query).catch(() => [])
      ]);

      // Format Indian foods to match USDA format
      const formattedIndianFoods = indian.map(convertIndianFoodToSearchResult);
      
      // Combine results, showing Indian foods first (since they're more relevant)
      return [...formattedIndianFoods, ...usda];
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error searching for foods');
      setError(error);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  return {
    searchFoods, // Original USDA search
    searchIndianFoods: searchIndianFoodsWithFormat, // Indian foods search
    searchAllFoods, // Combined search
    isSearching: isSearching || isSearchingIndian,
    error
  };
};
