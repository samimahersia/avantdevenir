import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import AppointmentManagement from "./admin/AppointmentManagement";
import UserManagement from "./admin/UserManagement";
import NotificationSettings from "./admin/NotificationSettings";
import AppointmentCalendar from "./admin/AppointmentCalendar";
import AppointmentStats from "./AppointmentStats";
import RecurringAvailabilityForm from "./RecurringAvailabilityForm";
import TechnicalSupport from "./admin/TechnicalSupport";
import ConsulateManagement from "./admin/ConsulateManagement";
import ServiceManagement from "./admin/ServiceManagement";
import HolidayManagement from "./admin/HolidayManagement";

interface AdminDashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const AdminDashboard = ({ activeTab = "appointments", onTabChange }: AdminDashboardProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const isMobile = useIsMobile();

  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-[#D3E4FD] to-[#E5DEFF] p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-center">Tableau de bord administrateur</h2>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {!isMobile && (
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-8">
            <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="consulates">Organismes</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
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
                <RecurringAvailabilityForm />
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
    </div>
  );
};

export default AdminDashboard;