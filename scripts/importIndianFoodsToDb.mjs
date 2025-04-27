import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import XLSX from 'xlsx';
import { db } from '../server/db.js';
import { indianFoods } from '../shared/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    // Path to the Excel file
    const excelFilePath = path.join(__dirname, '../attached_assets/ANUVAAD_INDB_2024.xlsx');
    
    console.log(`Reading Excel file: ${excelFilePath}`);
    
    // Read the Excel file
    const workbook = XLSX.readFile(excelFilePath);
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    console.log(`Found sheet: ${sheetName}`);
    
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert the sheet to JSON with header row
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Found ${data.length} rows of data`);
    
    // Map the Excel columns to our database schema
    const foodsToInsert = data.map(row => {
      return {
        foodCode: row.food_code?.toString() || null,
        foodName: row.food_name || 'Unknown Food',
        foodGroup: row.food_group_nin || null,
        description: null, // No description in this dataset
        calories: parseFloat(row.energy_kcal || 0) || 0,
        protein: parseFloat(row.protein_g || 0) || 0,
        carbs: parseFloat(row.carb_g || 0) || 0,
        fat: parseFloat(row.fat_g || 0) || 0,
        fiber: parseFloat(row.fibre_g || 0) || 0,
        calcium: parseFloat(row.calcium_mg || 0) || 0,
        iron: parseFloat(row.iron_mg || 0) || 0,
      };
    });
    
    console.log(`Mapped ${foodsToInsert.length} foods for database import`);
    
    // Now import to database
    return await importToDatabase(foodsToInsert);
    
  } catch (error) {
    console.error("Error in processing Excel file:", error);
    return { success: false, error: error.message };
  }
}

async function importToDatabase(foods) {
  if (!Array.isArray(foods) || foods.length === 0) {
    console.error("No valid foods data to insert");
    return { success: false, error: "No valid foods data" };
  }
  
  try {
    console.log(`Starting to insert ${foods.length} Indian foods into the database...`);
    
    // First truncate the table to avoid duplicates
    await db.delete(indianFoods);
    console.log("Cleared existing Indian foods data from database");
    
    // Insert in batches to avoid overwhelming the database
    const batchSize = 100;
    let insertedCount = 0;
    
    for (let i = 0; i < foods.length; i += batchSize) {
      const batch = foods.slice(i, i + batchSize);
      const result = await db.insert(indianFoods).values(batch).returning();
      insertedCount += result.length;
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(foods.length / batchSize)} (${insertedCount} total foods)`);
    }
    
    console.log(`Successfully imported ${insertedCount} Indian foods into the database`);
    return { success: true, count: insertedCount };
  } catch (error) {
    console.error("Error importing to database:", error);
    return { success: false, error: error.message };
  }
}

// Run the main function
main()
  .then(result => {
    if (result.success) {
      console.log(`Import completed successfully! Imported ${result.count} food items.`);
      process.exit(0);
    } else {
      console.error(`Import failed: ${result.error}`);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error("Unexpected error:", err);
    process.exit(1);
  });