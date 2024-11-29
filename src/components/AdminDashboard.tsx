import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AppointmentManagement from "./admin/AppointmentManagement";
import UserManagement from "./admin/UserManagement";
import NotificationSettings from "./admin/NotificationSettings";
import AppointmentCalendar from "./admin/AppointmentCalendar";
import AppointmentStats from "./AppointmentStats";
import RecurringAvailabilityForm from "./RecurringAvailabilityForm";
import TechnicalSupport from "./admin/TechnicalSupport";

const AdminDashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Tableau de bord administrateur</h2>
      
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-6">
          <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>
        
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
        
        <TabsContent value="settings" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Disponibilités récurrentes</h3>
                <RecurringAvailabilityForm />
              </CardContent>
            </Card>
            
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