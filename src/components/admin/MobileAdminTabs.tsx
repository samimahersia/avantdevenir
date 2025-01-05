import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MobileAdminTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const MobileAdminTabs = ({ activeTab, onTabChange }: MobileAdminTabsProps) => {
  return (
    <TabsList className="flex flex-col h-auto bg-sidebar-accent dark:bg-gray-800 p-1 gap-0.5">
      <TabsTrigger 
        value="appointments" 
        className="w-full justify-start text-white data-[state=active]:text-primary data-[state=active]:font-medium hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
        onClick={() => onTabChange("appointments")}
      >
        Rendez-vous
      </TabsTrigger>
      <TabsTrigger 
        value="stats" 
        className="w-full justify-start text-white data-[state=active]:text-primary data-[state=active]:font-medium hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
        onClick={() => onTabChange("stats")}
      >
        Statistiques
      </TabsTrigger>
      <TabsTrigger 
        value="consulates" 
        className="w-full justify-start text-white data-[state=active]:text-primary data-[state=active]:font-medium hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
        onClick={() => onTabChange("consulates")}
      >
        Organismes
      </TabsTrigger>
      <TabsTrigger 
        value="services" 
        className="w-full justify-start text-white data-[state=active]:text-primary data-[state=active]:font-medium hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
        onClick={() => onTabChange("services")}
      >
        Services
      </TabsTrigger>
      <TabsTrigger 
        value="users" 
        className="w-full justify-start text-white data-[state=active]:text-primary data-[state=active]:font-medium hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
        onClick={() => onTabChange("users")}
      >
        Utilisateurs
      </TabsTrigger>
      <TabsTrigger 
        value="holidays" 
        className="w-full justify-start text-white data-[state=active]:text-primary data-[state=active]:font-medium hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
        onClick={() => onTabChange("holidays")}
      >
        Jours fériés
      </TabsTrigger>
      <TabsTrigger 
        value="settings" 
        className="w-full justify-start text-white data-[state=active]:text-primary data-[state=active]:font-medium hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
        onClick={() => onTabChange("settings")}
      >
        Planification
      </TabsTrigger>
      <TabsTrigger 
        value="notifications" 
        className="w-full justify-start text-white data-[state=active]:text-primary data-[state=active]:font-medium hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
        onClick={() => onTabChange("notifications")}
      >
        Notifications
      </TabsTrigger>
      <TabsTrigger 
        value="support" 
        className="w-full justify-start text-white data-[state=active]:text-primary data-[state=active]:font-medium hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
        onClick={() => onTabChange("support")}
      >
        Support
      </TabsTrigger>
    </TabsList>
  );
};