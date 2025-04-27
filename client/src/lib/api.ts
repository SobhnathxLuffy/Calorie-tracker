// API utility functions for nutrition data

export async function searchFoods(query: string) {
  try {
    const response = await fetch(`/api/nutrition/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Search failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data.foods || [];
  } catch (error) {
    console.error("Error searching for foods:", error);
    throw error;
  }
}

export async function getFoodDetails(fdcId: string) {
  try {
    const response = await fetch(`/api/nutrition/food/${fdcId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Food details request failed: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error getting food details:", error);
    throw error;
  }
}

// Indian foods database API functions
export async function searchIndianFoods(query: string) {
  try {
    const response = await fetch(`/api/indian-foods/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Indian foods search failed: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error searching for Indian foods:", error);
    throw error;
  }
}

export async function getIndianFoodById(id: number) {
  try {
    const response = await fetch(`/api/indian-foods/${id}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Indian food details request failed: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error getting Indian food details:", error);
    throw error;
  }
}
