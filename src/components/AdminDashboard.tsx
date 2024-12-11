import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Save, Calendar as CalendarIcon, BarChart3, Users, Building2, Wrench, Settings, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  const location = useLocation();
  const [selectedAvailability, setSelectedAvailability] = useState(null);

  const handleSave = () => {
    // Créer un élément <a> temporaire
    const element = document.createElement('a');
    
    // Obtenir tout le contenu HTML de la page
    const htmlContent = document.documentElement.outerHTML;
    
    // Créer un Blob avec le contenu HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Créer une URL pour le Blob
    element.href = URL.createObjectURL(blob);
    
    // Définir le nom du fichier
    const date = new Date().toISOString().split('T')[0];
    element.download = `sauvegarde-site-${date}.html`;
    
    // Simuler un clic pour déclencher le téléchargement
    document.body.appendChild(element);
    element.click();
    
    // Nettoyer
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
    
    toast.success("Site sauvegardé avec succès");
  };

  useEffect(() => {
    const handleTabSwitch = (event: CustomEvent) => {
      if (onTabChange) {
        onTabChange(event.detail.tab);
        if (event.detail.availability) {
          setSelectedAvailability(event.detail.availability);
        }
      }
    };

    window.addEventListener('switchTab', handleTabSwitch as EventListener);
    return () => {
      window.removeEventListener('switchTab', handleTabSwitch as EventListener);
    };
  }, [onTabChange]);

  useEffect(() => {
    if (location.state?.activeTab && onTabChange) {
      onTabChange(location.state.activeTab);
      if (location.state.availabilityToEdit) {
        setSelectedAvailability(location.state.availabilityToEdit);
      }
    }
  }, [location.state, onTabChange]);

  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  // Requête pour obtenir les statistiques des rendez-vous
  const { data: stats } = useQuery({
    queryKey: ["appointment-stats"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: totalAppointments } = await supabase
        .from("appointments")
        .select("count")
        .single();

      const { data: completedToday } = await supabase
        .from("appointments")
        .select("count")
        .eq("status", "termine")
        .gte("date", today.toISOString())
        .single();

      const { data: upcomingToday } = await supabase
        .from("appointments")
        .select("count")
        .eq("status", "confirme")
        .gte("date", today.toISOString())
        .lte("date", new Date(today.setHours(23, 59, 59, 999)).toISOString())
        .single();

      const { data: canceledToday } = await supabase
        .from("appointments")
        .select("count")
        .eq("status", "annule")
        .gte("date", today.toISOString())
        .single();

      return {
        total: totalAppointments?.count || 0,
        completed: completedToday?.count || 0,
        upcoming: upcomingToday?.count || 0,
        canceled: canceledToday?.count || 0
      };
    }
  });

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">
          Tableau de Bord
        </h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleSave}
              >
                <Save className="h-4 w-4" />
                <span className="sr-only">Sauvegarder le site</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sauvegarder le site</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total des Rendez-vous</p>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Terminés aujourd'hui</p>
                <p className="text-2xl font-bold">{stats?.completed || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-100">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">À venir aujourd'hui</p>
                <p className="text-2xl font-bold">{stats?.upcoming || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-100">
                <Building2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Annulés aujourd'hui</p>
                <p className="text-2xl font-bold">{stats?.canceled || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-6">Gestion des Rendez-vous</h3>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
    </div>
  );
};

export default AdminDashboard;