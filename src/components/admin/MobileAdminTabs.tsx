import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MobileAdminTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const MobileAdminTabs = ({ activeTab, onTabChange }: MobileAdminTabsProps) => {
  return (
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
        Planification
      </TabsTrigger>
      <TabsTrigger 
        value="notifications" 
        className="w-full justify-start text-sidebar-foreground dark:text-gray-300 hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
      >
        Historique
      </TabsTrigger>
      <TabsTrigger 
        value="subscription" 
        className="w-full justify-start text-sidebar-foreground dark:text-gray-300 hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
      >
        Abonnement
      </TabsTrigger>
      <TabsTrigger 
        value="support" 
        className="w-full justify-start text-sidebar-foreground dark:text-gray-300 hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
      >
        Support
      </TabsTrigger>
      <TabsTrigger 
        value="settings" 
        className="w-full justify-start text-sidebar-foreground dark:text-gray-300 hover:bg-sidebar-accent-foreground/10 dark:hover:bg-gray-700 data-[state=active]:bg-sidebar-accent-foreground/20 dark:data-[state=active]:bg-gray-600 transition-colors"
      >
        Paramètres
      </TabsTrigger>
    </TabsList>
  );
};