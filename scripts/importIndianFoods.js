import { readFile } from 'node:fs/promises';
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
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
    console.log("Sample data (first 2 rows):");
    console.log(JSON.stringify(data.slice(0, 2), null, 2));
    
    // Now we'll map the Excel columns to our database schema
    // First, let's log the column headers to understand the structure
    if (data.length > 0) {
      console.log("Column headers:");
      console.log(Object.keys(data[0]));
    }
    
    // Let's prepare the data for insertion into our database
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
    
    console.log(`Prepared ${foodsToInsert.length} foods for insertion`);
    console.log("Sample food item to insert:");
    console.log(JSON.stringify(foodsToInsert[0], null, 2));
    
    // Let's ask if we should proceed with insertion
    console.log("Ready to insert data into the database.");
    console.log("To insert data, call importIndianFoodsToDatabase() separately.");
    
    return foodsToInsert;
  } catch (error) {
    console.error("Error in main function:", error);
    return [];
  }
}

// Database import function
async function importToDatabase(foods) {
  if (!Array.isArray(foods) || foods.length === 0) {
    console.error("No valid foods data to insert");
    return;
  }
  
  try {
    console.log(`Starting to insert ${foods.length} Indian foods into the database...`);
    
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
  } catch (error) {
    console.error("Error importing to database:", error);
  }
}

// Execute the main function to parse the data
const foods = await main();

// Ask if we should import to database
const args = process.argv.slice(2);
if (args.includes('--import')) {
  console.log('Import flag detected, proceeding with database import...');
  await importToDatabase(foods);
} else {
  console.log('To import data to database, run with the --import flag:');
  console.log('node scripts/importIndianFoods.js --import');
}