import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NutritionGoalsSettings from "@/components/NutritionGoalsSettings";
import AddCustomFoodForm from "@/components/AddCustomFoodForm";
import CustomFoodsList from "@/components/CustomFoodsList";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, UserCircle, Utensils, BarChart, Home } from "lucide-react";
import { Link, useLocation } from "wouter";

const Settings = () => {
  const [userId, setUserId] = useState<number>(1); // Default user ID
  const [darkMode, setDarkMode] = useState<boolean>(document.documentElement.classList.contains('dark'));
  const [location, navigate] = useLocation();
  
  // Toggle dark mode
  const toggleDarkMode = (enabled: boolean) => {
    setDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  // Initialize dark mode based on saved preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    toggleDarkMode(savedDarkMode);
  }, []);

  const goToHome = () => {
    navigate("/");
  };
  
  return (
    <div className="container py-8 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <SettingsIcon className="h-8 w-8 mr-2 text-primary" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={goToHome}
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
      
      <Tabs defaultValue="foods" className="w-full">
        <TabsList className="mb-4 grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="profile" className="text-sm flex items-center gap-1">
            <UserCircle className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="text-sm flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>Goals</span>
          </TabsTrigger>
          <TabsTrigger value="foods" className="text-sm flex items-center gap-1">
            <Utensils className="h-4 w-4" />
            <span>Foods</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <UserCircle className="h-5 w-5" />
                  User Profile
                </CardTitle>
                <CardDescription>
                  Manage your account settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                </div>
                
                <div className="text-sm text-gray-500">
                  <p>User ID: {userId}</p>
                  <p>Email: user@example.com</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="goals" className="space-y-4">
          <NutritionGoalsSettings userId={userId} />
        </TabsContent>
        
        <TabsContent value="foods" className="space-y-4">
          <div className="grid gap-6">
            <AddCustomFoodForm userId={userId} />
            <CustomFoodsList userId={userId} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;