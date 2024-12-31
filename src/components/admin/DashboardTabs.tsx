import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, BarChart3, Users, Building2, Wrench, Settings, HelpCircle } from "lucide-react";
import AppointmentManagement from "./AppointmentManagement";
import UserManagement from "./UserManagement";
import NotificationSettings from "./NotificationSettings";
import AppointmentCalendar from "./AppointmentCalendar";
import AppointmentStats from "../AppointmentStats";
import RecurringAvailabilityForm from "../RecurringAvailabilityForm";
import TechnicalSupport from "./TechnicalSupport";
import ConsulateManagement from "./ConsulateManagement";
import ServiceManagement from "./ServiceManagement";
import HolidayManagement from "./HolidayManagement";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  isMobile: boolean;
  selectedAvailability: any;
}

const DashboardTabs = ({ activeTab, onTabChange, isMobile, selectedAvailability }: DashboardTabsProps) => {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-6">Gestion des Rendez-vous</h3>
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          {!isMobile && (
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              <TabsTrigger value="appointments" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Rendez-vous
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Calendrier
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Statistiques
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="consulates" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Organismes
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Services
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Paramètres
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Support
              </TabsTrigger>
            </TabsList>
          )}
          
          <TabsContent value="appointments" className="mt-6">
            <AppointmentManagement />
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-6">
            <AppointmentCalendar />
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <AppointmentStats />
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="consulates" className="mt-6">
            <ConsulateManagement />
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <ServiceManagement />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Horaires d'ouverture</h3>
                  <RecurringAvailabilityForm initialAvailability={selectedAvailability} />
                </CardContent>
              </Card>

              <HolidayManagement />
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Paramètres des notifications</h3>
                  <NotificationSettings />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="support" className="mt-6">
            <TechnicalSupport />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DashboardTabs;