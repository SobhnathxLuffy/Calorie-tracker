import { 
  users, type User, type InsertUser,
  foodItems, type FoodItem, type InsertFoodItem,
  userGoals, type UserGoal, type InsertUserGoal,
  indianFoods, type IndianFood, type InsertIndianFood,
  customFoods, type CustomFood, type InsertCustomFood,
  waterIntake, type WaterIntake, type InsertWaterIntake
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like, sql, ilike } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getFoodItems(userId: number, date: string): Promise<FoodItem[]>;
  getFoodItemsByMealType(userId: number, date: string, mealType: string): Promise<FoodItem[]>;
  createFoodItem(foodItem: InsertFoodItem): Promise<FoodItem>;
  deleteFoodItem(id: number): Promise<boolean>;
  
  getUserGoals(userId: number): Promise<UserGoal | undefined>;
  createUserGoals(userGoal: InsertUserGoal): Promise<UserGoal>;
  updateUserGoals(userId: number, userGoal: Partial<Omit<InsertUserGoal, "userId">>): Promise<UserGoal | undefined>;
  
  // Indian foods database methods
  getIndianFoods(): Promise<IndianFood[]>;
  getIndianFoodById(id: number): Promise<IndianFood | undefined>;
  searchIndianFoods(query: string): Promise<IndianFood[]>;
  createIndianFood(food: InsertIndianFood): Promise<IndianFood>;
  createManyIndianFoods(foods: InsertIndianFood[]): Promise<IndianFood[]>;
  
  // Custom foods methods
  getCustomFoods(userId: number): Promise<CustomFood[]>;
  getCustomFoodById(id: number): Promise<CustomFood | undefined>;
  searchCustomFoods(userId: number, query: string): Promise<CustomFood[]>;
  createCustomFood(food: InsertCustomFood): Promise<CustomFood>;
  deleteCustomFood(id: number): Promise<boolean>;
  
  // Water intake methods
  getWaterIntake(userId: number, date: string): Promise<WaterIntake | undefined>;
  createOrUpdateWaterIntake(data: InsertWaterIntake): Promise<WaterIntake>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getFoodItems(userId: number, date: string): Promise<FoodItem[]> {
    return await db.select()
      .from(foodItems)
      .where(and(
        eq(foodItems.userId, userId),
        eq(foodItems.date, date)
      ));
  }

  async getFoodItemsByMealType(userId: number, date: string, mealType: string): Promise<FoodItem[]> {
    return await db.select()
      .from(foodItems)
      .where(and(
        eq(foodItems.userId, userId),
        eq(foodItems.date, date),
        eq(foodItems.mealType, mealType)
      ));
  }

  async createFoodItem(insertFoodItem: InsertFoodItem): Promise<FoodItem> {
    const result = await db.insert(foodItems)
      .values({
        ...insertFoodItem,
        userId: insertFoodItem.userId || null,
        fdcId: insertFoodItem.fdcId || null
      })
      .returning();
    return result[0];
  }

  async deleteFoodItem(id: number): Promise<boolean> {
    const result = await db.delete(foodItems)
      .where(eq(foodItems.id, id))
      .returning({ id: foodItems.id });
    return result.length > 0;
  }

  async getUserGoals(userId: number): Promise<UserGoal | undefined> {
    const result = await db.select()
      .from(userGoals)
      .where(eq(userGoals.userId, userId));
    return result[0];
  }

  async createUserGoals(insertUserGoal: InsertUserGoal): Promise<UserGoal> {
    const result = await db.insert(userGoals)
      .values({
        ...insertUserGoal,
        userId: insertUserGoal.userId || null
      })
      .returning();
    return result[0];
  }

  async updateUserGoals(userId: number, userGoalUpdates: Partial<Omit<InsertUserGoal, "userId">>): Promise<UserGoal | undefined> {
    const existing = await this.getUserGoals(userId);
    
    if (!existing) {
      return undefined;
    }
    
    const result = await db.update(userGoals)
      .set(userGoalUpdates)
      .where(eq(userGoals.id, existing.id))
      .returning();
    
    return result[0];
  }

  // Indian foods methods
  async getIndianFoods(): Promise<IndianFood[]> {
    return await db.select().from(indianFoods);
  }
  
  async getIndianFoodById(id: number): Promise<IndianFood | undefined> {
    const result = await db.select().from(indianFoods).where(eq(indianFoods.id, id));
    return result[0];
  }
  
  async searchIndianFoods(query: string): Promise<IndianFood[]> {
    return await db.select()
      .from(indianFoods)
      .where(ilike(indianFoods.foodName, `%${query}%`))
      .limit(20);
  }
  
  async createIndianFood(food: InsertIndianFood): Promise<IndianFood> {
    const result = await db.insert(indianFoods)
      .values(food)
      .returning();
    return result[0];
  }
  
  async createManyIndianFoods(foods: InsertIndianFood[]): Promise<IndianFood[]> {
    if (foods.length === 0) {
      return [];
    }
    
    const result = await db.insert(indianFoods)
      .values(foods)
      .returning();
    return result;
  }
  
  // Custom foods methods
  async getCustomFoods(userId: number): Promise<CustomFood[]> {
    return await db.select()
      .from(customFoods)
      .where(eq(customFoods.userId, userId))
      .orderBy(customFoods.foodName);
  }
  
  async getCustomFoodById(id: number): Promise<CustomFood | undefined> {
    const result = await db.select()
      .from(customFoods)
      .where(eq(customFoods.id, id));
    return result[0];
  }
  
  async searchCustomFoods(userId: number, query: string): Promise<CustomFood[]> {
    return await db.select()
      .from(customFoods)
      .where(
        and(
          eq(customFoods.userId, userId),
          ilike(customFoods.foodName, `%${query}%`)
        )
      )
      .limit(20);
  }
  
  async createCustomFood(food: InsertCustomFood): Promise<CustomFood> {
    const result = await db.insert(customFoods)
      .values(food)
      .returning();
    return result[0];
  }
  
  async deleteCustomFood(id: number): Promise<boolean> {
    const result = await db.delete(customFoods)
      .where(eq(customFoods.id, id))
      .returning({ id: customFoods.id });
    return result.length > 0;
  }
  
  // Water intake methods
  async getWaterIntake(userId: number, date: string): Promise<WaterIntake | undefined> {
    const result = await db.select()
      .from(waterIntake)
      .where(
        and(
          eq(waterIntake.userId, userId),
          eq(waterIntake.date, date)
        )
      );
    return result[0];
  }
  
  async createOrUpdateWaterIntake(data: InsertWaterIntake): Promise<WaterIntake> {
    // Check if a record already exists for this user and date
    const existing = await this.getWaterIntake(data.userId, data.date);
    
    if (existing) {
      // Update existing record
      const result = await db.update(waterIntake)
        .set({
          amount: data.amount,
          goal: data.goal
        })
        .where(eq(waterIntake.id, existing.id))
        .returning();
      return result[0];
    } else {
      // Create new record
      const result = await db.insert(waterIntake)
        .values(data)
        .returning();
      return result[0];
    }
  }
}

export const storage = new DatabaseStorage();
