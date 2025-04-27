import { RotateCw, Settings, RefreshCw } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [location, navigate] = useLocation();
  const isMobile = useIsMobile();

  const handleRefresh = () => {
    window.location.reload();
  };

  const goToSettings = () => {
    navigate("/settings");
  };

  return (
    <header className="mb-4 md:mb-6 px-2 md:px-0">
      <div className="flex justify-between items-center">
        <Link href="/">
          <span className={`${isMobile ? "text-2xl" : "text-3xl"} font-bold text-primary-dark cursor-pointer`}>
            {isMobile ? "Tracker" : "Calorie Tracker"}
          </span>
        </Link>
        <div className="flex space-x-2 md:space-x-4">
          <Button 
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-primary transition touch-manipulation"
            onClick={handleRefresh}
            aria-label="Refresh"
          >
            <RotateCw className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={goToSettings}
            className="text-gray-600 hover:text-primary transition touch-manipulation"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
