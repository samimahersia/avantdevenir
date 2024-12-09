import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AppointmentForm from "./AppointmentForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { X } from "lucide-react";

interface ClientDashboardProps {
  selectedConsulate?: string;
  selectedService?: string;
}

const ClientDashboard = ({ selectedConsulate, selectedService }: ClientDashboardProps) => {
  const { t } = useTranslation();
  
  const { data: appointments = [], refetch } = useQuery({
    queryKey: ["appointments", selectedConsulate],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user.id) {
        throw new Error("User not authenticated");
      }

      const query = supabase
        .from("appointments")
        .select("*, services(name)")
        .eq("client_id", session.session.user.id)
        .order("date", { ascending: true });

      if (selectedConsulate) {
        query.eq("consulate_id", selectedConsulate);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching appointments:", error);
        throw error;
      }
      return data;
    },
    enabled: true
  });

  const handleCancel = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "refuse" })
        .eq("id", appointmentId);

      if (error) {
        console.error("Error canceling appointment:", error);
        toast.error("Erreur lors de l'annulation du rendez-vous");
        return;
      }

      toast.success("Rendez-vous annulé avec succès");
      refetch();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Une erreur est survenue");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_attente":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">{t('status.pending')}</Badge>;
      case "approuve":
        return <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">{t('status.approved')}</Badge>;
      case "refuse":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">{t('status.rejected')}</Badge>;
      default:
        return null;
    }
  };

  const canModifyAppointment = (appointment: any) => {
    return appointment.status === "en_attente" && new Date(appointment.date) > new Date();
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <Card className="border-none shadow-none">
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-xl md:text-2xl font-semibold">{t('dashboard.myAppointments')}</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex flex-col p-4 md:p-6 border rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-2 mb-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <h3 className="text-base md:text-lg font-medium">{appointment.title}</h3>
                    {getStatusBadge(appointment.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard.service')} : {appointment.services?.name}
                  </p>
                  {appointment.description && (
                    <p className="text-sm text-muted-foreground">{appointment.description}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(appointment.date), "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr })}
                  </p>
                </div>
                {canModifyAppointment(appointment) && (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleCancel(appointment.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      <span>Annuler</span>
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {appointments.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                {t('dashboard.noAppointments')}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {!selectedConsulate || !selectedService ? (
        <Card className="border-none shadow-none">
          <CardContent className="text-center py-6 md:py-8">
            <p className="text-muted-foreground">
              {t('dashboard.selectPrompt')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-none">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-xl md:text-2xl font-semibold">{t('dashboard.newAppointment')}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <AppointmentForm 
              onSuccess={refetch} 
              selectedConsulate={selectedConsulate}
              selectedService={selectedService}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientDashboard;