import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { 
  insertFoodItemSchema, 
  insertUserGoalSchema, 
  insertIndianFoodSchema,
  insertCustomFoodSchema,
  insertWaterIntakeSchema,
  waterIntake
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();

  // Food items routes
  apiRouter.get("/food-items", async (req, res) => {
    const { userId, date } = req.query;

    if (!userId || !date) {
      return res.status(400).json({ message: "userId and date query parameters are required" });
    }

    try {
      const items = await storage.getFoodItems(Number(userId), date as string);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to get food items" });
    }
  });

  apiRouter.get("/food-items/meal", async (req, res) => {
    const { userId, date, mealType } = req.query;

    if (!userId || !date || !mealType) {
      return res.status(400).json({ message: "userId, date, and mealType query parameters are required" });
    }

    try {
      const items = await storage.getFoodItemsByMealType(
        Number(userId), 
        date as string, 
        mealType as string
      );
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to get food items for meal type" });
    }
  });

  apiRouter.post("/food-items", async (req, res) => {
    try {
      const parsedBody = insertFoodItemSchema.parse(req.body);
      const newItem = await storage.createFoodItem(parsedBody);
      res.status(201).json(newItem);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create food item" });
      }
    }
  });

  apiRouter.delete("/food-items/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const success = await storage.deleteFoodItem(Number(id));
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Food item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete food item" });
    }
  });

  // User goals routes
  apiRouter.get("/user-goals/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
      const goals = await storage.getUserGoals(Number(userId));
      if (goals) {
        res.json(goals);
      } else {
        // Create default goals if none exist
        const defaultGoals = {
          userId: Number(userId),
          calorieGoal: 2000,
          proteinGoal: 120,
          carbsGoal: 250,
          fatGoal: 65
        };
        const newGoals = await storage.createUserGoals(defaultGoals);
        res.json(newGoals);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to get user goals" });
    }
  });

  apiRouter.post("/user-goals", async (req, res) => {
    try {
      const parsedBody = insertUserGoalSchema.parse(req.body);
      const newGoals = await storage.createUserGoals(parsedBody);
      res.status(201).json(newGoals);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create user goals" });
      }
    }
  });

  apiRouter.patch("/user-goals/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
      const updatedGoals = await storage.updateUserGoals(Number(userId), req.body);
      if (updatedGoals) {
        res.json(updatedGoals);
      } else {
        res.status(404).json({ message: "User goals not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update user goals" });
    }
  });

  // Nutrition API proxy to avoid CORS issues
  apiRouter.get("/nutrition/search", async (req, res) => {
    const { query } = req.query;
    const apiKey = process.env.USDA_API_KEY || "DEMO_KEY";
    
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(query as string)}&pageSize=10`
      );
      
      if (!response.ok) {
        throw new Error(`Nutrition API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to fetch nutrition data" });
      }
    }
  });

  apiRouter.get("/nutrition/food/:fdcId", async (req, res) => {
    const { fdcId } = req.params;
    const apiKey = process.env.USDA_API_KEY || "DEMO_KEY";
    
    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Nutrition API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to fetch food details" });
      }
    }
  });

  // Indian foods routes
  apiRouter.get("/indian-foods", async (req, res) => {
    try {
      const foods = await storage.getIndianFoods();
      res.json(foods);
    } catch (error) {
      res.status(500).json({ message: "Failed to get Indian foods" });
    }
  });

  apiRouter.get("/indian-foods/search", async (req, res) => {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }
    
    try {
      const foods = await storage.searchIndianFoods(query as string);
      res.json(foods);
    } catch (error) {
      res.status(500).json({ message: "Failed to search Indian foods" });
    }
  });

  apiRouter.get("/indian-foods/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
      const food = await storage.getIndianFoodById(Number(id));
      if (food) {
        res.json(food);
      } else {
        res.status(404).json({ message: "Indian food not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to get Indian food" });
    }
  });

  apiRouter.post("/indian-foods", async (req, res) => {
    try {
      const parsedBody = insertIndianFoodSchema.parse(req.body);
      const newFood = await storage.createIndianFood(parsedBody);
      res.status(201).json(newFood);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create Indian food" });
      }
    }
  });

  apiRouter.post("/indian-foods/batch", async (req, res) => {
    try {
      // Validate each item in the array
      const foods = req.body;
      
      if (!Array.isArray(foods)) {
        return res.status(400).json({ message: "Request body must be an array" });
      }
      
      const validatedFoods = foods.map(food => insertIndianFoodSchema.parse(food));
      const createdFoods = await storage.createManyIndianFoods(validatedFoods);
      
      res.status(201).json(createdFoods);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create Indian foods batch" });
      }
    }
  });

  // Custom foods routes
  apiRouter.get("/custom-foods", async (req, res) => {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: "userId query parameter is required" });
    }
    
    try {
      const foods = await storage.getCustomFoods(Number(userId));
      res.json(foods);
    } catch (error) {
      res.status(500).json({ message: "Failed to get custom foods" });
    }
  });
  
  apiRouter.get("/custom-foods/search", async (req, res) => {
    const { userId, query } = req.query;
    
    if (!userId || !query) {
      return res.status(400).json({ message: "userId and query parameters are required" });
    }
    
    try {
      const foods = await storage.searchCustomFoods(Number(userId), query as string);
      res.json(foods);
    } catch (error) {
      res.status(500).json({ message: "Failed to search custom foods" });
    }
  });
  
  apiRouter.get("/custom-foods/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
      const food = await storage.getCustomFoodById(Number(id));
      if (food) {
        res.json(food);
      } else {
        res.status(404).json({ message: "Custom food not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to get custom food" });
    }
  });
  
  apiRouter.post("/custom-foods", async (req, res) => {
    try {
      const parsedBody = insertCustomFoodSchema.parse(req.body);
      const newFood = await storage.createCustomFood(parsedBody);
      res.status(201).json(newFood);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create custom food" });
      }
    }
  });
  
  apiRouter.delete("/custom-foods/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
      const success = await storage.deleteCustomFood(Number(id));
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Custom food not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete custom food" });
    }
  });
  
  // Water intake routes
  apiRouter.get("/water-intake", async (req, res) => {
    const { userId, date } = req.query;
    
    if (!userId || !date) {
      return res.status(400).json({ message: "userId and date query parameters are required" });
    }
    
    try {
      const intake = await storage.getWaterIntake(Number(userId), date as string);
      res.json(intake || { userId: Number(userId), date, amount: 0, goal: 2000 });
    } catch (error) {
      res.status(500).json({ message: "Failed to get water intake" });
    }
  });
  
  apiRouter.post("/water-intake", async (req, res) => {
    try {
      const parsedBody = insertWaterIntakeSchema.parse(req.body);
      const intake = await storage.createOrUpdateWaterIntake(parsedBody);
      res.status(201).json(intake);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create water intake" });
      }
    }
  });
  
  apiRouter.patch("/water-intake/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
      // Get the existing water intake record
      const existingIntake = await db.select()
        .from(waterIntake)
        .where(eq(waterIntake.id, Number(id)));
      
      if (existingIntake.length === 0) {
        return res.status(404).json({ message: "Water intake record not found" });
      }
      
      // Use the existing userId and date, but update amount and goal
      const updatedData = {
        userId: existingIntake[0].userId,
        date: existingIntake[0].date,
        amount: req.body.amount || existingIntake[0].amount,
        goal: req.body.goal || existingIntake[0].goal
      };
      
      const intake = await storage.createOrUpdateWaterIntake(updatedData);
      res.json(intake);
    } catch (error) {
      res.status(500).json({ message: "Failed to update water intake" });
    }
  });

  // Register the API router
  app.use('/api', apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}
