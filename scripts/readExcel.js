import fs from 'fs';
import * as XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the Excel file
const excelFilePath = path.join(__dirname, '../attached_assets/ANUVAAD_INDB_2024.xlsx');

try {
  // Read Excel file
  const workbook = XLSX.readFile(excelFilePath);
  
  // Get the sheet names
  const sheetNames = workbook.SheetNames;
  console.log('Sheet names:', sheetNames);
  
  // Get the data from the first sheet
  const firstSheetName = sheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  // Convert to JSON
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  // Print the first few rows to understand the structure
  console.log('First 5 rows:');
  data.slice(0, 5).forEach(row => {
    console.log(row);
  });
  
  // Print the total number of rows
  console.log(`Total rows: ${data.length}`);
  
  // If there's a header row, let's identify the columns
  if (data.length > 0) {
    console.log('Column headers:');
    data[0].forEach((header, index) => {
      console.log(`${index}: ${header}`);
    });
  }
} catch (error) {
  console.error('Error reading Excel file:', error);
}