import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Fermer le menu après la sélection en utilisant l'API du Sheet
    const sheetCloseButton = document.querySelector('[data-radix-collection-item]');
    if (sheetCloseButton instanceof HTMLElement) {
      sheetCloseButton.click();
    }
  };

  const handleUserTypeChange = (type: "client" | "admin") => {
    setUserType(type);
    // Fermer le menu après le changement de type d'utilisateur
    const sheetCloseButton = document.querySelector('[data-radix-collection-item]');
    if (sheetCloseButton instanceof HTMLElement) {
      sheetCloseButton.click();
    }
  };

  return (
    <Sheet>
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
                    <TabsList className="flex flex-col h-auto bg-sidebar-accent dark:bg-gray-800 p-2 gap-1">
                      <TabsTrigger 
                        value="appointments" 
                        className="w-full justify-start text-sidebar-foreground dark:text-gray-300 hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
                      >
                        Rendez-vous
                      </TabsTrigger>
                      <TabsTrigger 
                        value="calendar" 
                        className="w-full justify-start text-sidebar-foreground dark:text-gray-300 hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
                      >
                        Calendrier
                      </TabsTrigger>
                      <TabsTrigger 
                        value="stats" 
                        className="w-full justify-start text-sidebar-foreground dark:text-gray-300 hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
                      >
                        Statistiques
                      </TabsTrigger>
                      <TabsTrigger 
                        value="users" 
                        className="w-full justify-start text-sidebar-foreground dark:text-gray-300 hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
                      >
                        Utilisateurs
                      </TabsTrigger>
                      <TabsTrigger 
                        value="consulates" 
                        className="w-full justify-start text-sidebar-foreground dark:text-gray-300 hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
                      >
                        Organismes
                      </TabsTrigger>
                      <TabsTrigger 
                        value="services" 
                        className="w-full justify-start text-sidebar-foreground dark:text-gray-300 hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
                      >
                        Services
                      </TabsTrigger>
                      <TabsTrigger 
                        value="settings" 
                        className="w-full justify-start text-sidebar-foreground dark:text-gray-300 hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
                      >
                        Paramètres
                      </TabsTrigger>
                      <TabsTrigger 
                        value="support" 
                        className="w-full justify-start text-sidebar-foreground dark:text-gray-300 hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
                      >
                        Support
                      </TabsTrigger>
                    </TabsList>
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