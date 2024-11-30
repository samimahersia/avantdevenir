import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu } from "lucide-react";

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
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col gap-4 py-4">
          <Button
            variant={userType === "client" ? "default" : "outline"}
            onClick={() => setUserType("client")}
            className="w-full"
          >
            Mode Client
          </Button>
          {userRole === "admin" && (
            <div className="space-y-2">
              <Button
                variant={userType === "admin" ? "default" : "outline"}
                onClick={() => setUserType("admin")}
                className="w-full"
              >
                Mode Administrateur
              </Button>
              {userType === "admin" && (
                <div className="pl-4 space-y-2">
                  <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col h-auto">
                      <TabsTrigger value="appointments" className="w-full justify-start">
                        Rendez-vous
                      </TabsTrigger>
                      <TabsTrigger value="calendar" className="w-full justify-start">
                        Calendrier
                      </TabsTrigger>
                      <TabsTrigger value="stats" className="w-full justify-start">
                        Statistiques
                      </TabsTrigger>
                      <TabsTrigger value="users" className="w-full justify-start">
                        Utilisateurs
                      </TabsTrigger>
                      <TabsTrigger value="consulates" className="w-full justify-start">
                        Consulats
                      </TabsTrigger>
                      <TabsTrigger value="services" className="w-full justify-start">
                        Services
                      </TabsTrigger>
                      <TabsTrigger value="settings" className="w-full justify-start">
                        Paramètres
                      </TabsTrigger>
                      <TabsTrigger value="support" className="w-full justify-start">
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