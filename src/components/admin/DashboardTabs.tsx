import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentManagement from "./AppointmentManagement";
import ConsulateManagement from "./ConsulateManagement";
import ServiceManagement from "./ServiceManagement";
import UserManagement from "./UserManagement";
import HolidayManagement from "./HolidayManagement";
import NotificationSettings from "./NotificationSettings";
import TechnicalSupport from "./TechnicalSupport";
import AppointmentStats from "@/components/AppointmentStats";
import RecurringAvailabilityForm from "@/components/RecurringAvailabilityForm";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  isMobile?: boolean;
  selectedAvailability?: any;
}

const DashboardTabs = ({ activeTab, onTabChange, isMobile = false, selectedAvailability }: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <ScrollArea className="w-full">
        <TabsList className="w-full justify-start bg-transparent space-x-1 p-1 h-auto flex-wrap md:flex-nowrap">
          <TabsTrigger 
            value="appointments"
            className="text-sm md:text-base text-white data-[state=active]:text-primary data-[state=active]:font-medium transition-colors px-2 md:px-4 py-1.5"
          >
            Rendez-vous
          </TabsTrigger>
          <TabsTrigger 
            value="stats"
            className="text-sm md:text-base text-white data-[state=active]:text-primary data-[state=active]:font-medium transition-colors px-2 md:px-4 py-1.5"
          >
            Stats
          </TabsTrigger>
          <TabsTrigger 
            value="consulates"
            className="text-sm md:text-base text-white data-[state=active]:text-primary data-[state=active]:font-medium transition-colors px-2 md:px-4 py-1.5"
          >
            Organismes
          </TabsTrigger>
          <TabsTrigger 
            value="services"
            className="text-sm md:text-base text-white data-[state=active]:text-primary data-[state=active]:font-medium transition-colors px-2 md:px-4 py-1.5"
          >
            Services
          </TabsTrigger>
          <TabsTrigger 
            value="users"
            className="text-sm md:text-base text-white data-[state=active]:text-primary data-[state=active]:font-medium transition-colors px-2 md:px-4 py-1.5"
          >
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger 
            value="holidays"
            className="text-sm md:text-base text-white data-[state=active]:text-primary data-[state=active]:font-medium transition-colors px-2 md:px-4 py-1.5"
          >
            Jours fériés
          </TabsTrigger>
          <TabsTrigger 
            value="settings"
            className="text-sm md:text-base text-white data-[state=active]:text-primary data-[state=active]:font-medium transition-colors px-2 md:px-4 py-1.5"
          >
            Planning
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="text-sm md:text-base text-white data-[state=active]:text-primary data-[state=active]:font-medium transition-colors px-2 md:px-4 py-1.5"
          >
            Notifs
          </TabsTrigger>
          <TabsTrigger 
            value="support"
            className="text-sm md:text-base text-white data-[state=active]:text-primary data-[state=active]:font-medium transition-colors px-2 md:px-4 py-1.5"
          >
            Support
          </TabsTrigger>
        </TabsList>
      </ScrollArea>

      <TabsContent value="appointments" className="mt-6">
        <AppointmentManagement isMobile={isMobile} />
      </TabsContent>

      <TabsContent value="stats" className="mt-6">
        <AppointmentStats />
      </TabsContent>

      <TabsContent value="consulates" className="mt-6">
        <ConsulateManagement />
      </TabsContent>

      <TabsContent value="services" className="mt-6">
        <ServiceManagement />
      </TabsContent>

      <TabsContent value="users" className="mt-6">
        <UserManagement />
      </TabsContent>

      <TabsContent value="holidays" className="mt-6">
        <HolidayManagement />
      </TabsContent>

      <TabsContent value="settings" className="mt-6">
        <RecurringAvailabilityForm initialAvailability={selectedAvailability} />
      </TabsContent>

      <TabsContent value="notifications" className="mt-6">
        <NotificationSettings />
      </TabsContent>

      <TabsContent value="support" className="mt-6">
        <TechnicalSupport />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;