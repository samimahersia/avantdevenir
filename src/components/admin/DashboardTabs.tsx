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

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  isMobile?: boolean;
  selectedAvailability?: any;
}

const DashboardTabs = ({ activeTab, onTabChange, isMobile = false, selectedAvailability }: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full justify-start bg-transparent space-x-1">
        <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
        <TabsTrigger value="stats">Statistiques</TabsTrigger>
        <TabsTrigger value="consulates">Organismes</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        <TabsTrigger value="holidays">Jours fériés</TabsTrigger>
        <TabsTrigger value="settings">Planification</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="support">Support</TabsTrigger>
      </TabsList>

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