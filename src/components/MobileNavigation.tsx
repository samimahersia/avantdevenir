import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs } from "@/components/ui/tabs";
import { Menu } from "lucide-react";
import { useState } from "react";
import { MobileAdminTabs } from "./admin/MobileAdminTabs";

interface MobileNavigationProps {
  userType: "client" | "admin";
  setUserType: (type: "client" | "admin") => void;
  userRole: string | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNavigation = ({
  userType,
  setUserType,
  userRole,
  activeTab,
  setActiveTab
}: MobileNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsOpen(false);
  };

  const handleUserTypeChange = (type: "client" | "admin") => {
    setUserType(type);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-[300px] sm:w-[400px] bg-sidebar dark:bg-gray-900 border-r border-sidebar-border"
      >
        <div className="flex flex-col gap-4 py-4">
          {userRole !== "admin" && (
            <Button
              variant={userType === "client" ? "default" : "outline"}
              onClick={() => handleUserTypeChange("client")}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
            >
              Mode Client
            </Button>
          )}
          {userRole === "admin" && (
            <div className="space-y-2">
              <Button
                variant={userType === "admin" ? "default" : "outline"}
                onClick={() => handleUserTypeChange("admin")}
                className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Mode Administrateur
              </Button>
              {userType === "admin" && (
                <div className="pl-4 space-y-2">
                  <Tabs 
                    value={activeTab} 
                    onValueChange={handleTabChange} 
                    orientation="vertical" 
                    className="w-full"
                  >
                    <MobileAdminTabs activeTab={activeTab} onTabChange={handleTabChange} />
                  </Tabs>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};