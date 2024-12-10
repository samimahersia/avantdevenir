import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
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

  return (
    <div className="space-y-6 p-4 md:p-6 rounded-lg bg-gradient-to-br from-[#D3E4FD] to-[#E5DEFF]">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-semibold">
          Tableau de bord administrateur
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
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {!isMobile && (
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
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
        
        <TabsContent value="appointments" className="mt-4 md:mt-6">
          <AppointmentManagement />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-4 md:mt-6">
          <AppointmentCalendar />
        </TabsContent>

        <TabsContent value="stats" className="mt-4 md:mt-6">
          <AppointmentStats />
        </TabsContent>
        
        <TabsContent value="users" className="mt-4 md:mt-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="consulates" className="mt-4 md:mt-6">
          <ConsulateManagement />
        </TabsContent>

        <TabsContent value="services" className="mt-4 md:mt-6">
          <ServiceManagement />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4 md:mt-6">
          <div className="grid gap-4 md:gap-6">
            <Card>
              <CardContent className="pt-4 md:pt-6">
                <h3 className="text-base md:text-lg font-semibold mb-4">Horaires d'ouverture</h3>
                <RecurringAvailabilityForm initialAvailability={selectedAvailability} />
              </CardContent>
            </Card>

            <HolidayManagement />
            
            <Card>
              <CardContent className="pt-4 md:pt-6">
                <h3 className="text-base md:text-lg font-semibold mb-4">Paramètres des notifications</h3>
                <NotificationSettings />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="support" className="mt-4 md:mt-6">
          <TechnicalSupport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;