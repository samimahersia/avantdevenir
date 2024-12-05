import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AppointmentForm from "./AppointmentForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, isBefore, addHours } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

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

  const handleCancelAppointment = async (appointmentId: string, appointmentDate: string) => {
    const now = new Date();
    const appointmentTime = new Date(appointmentDate);
    
    // Vérifier si le rendez-vous est dans plus de 24h
    if (isBefore(appointmentTime, addHours(now, 24))) {
      toast.error(t('appointments.cancelError24h'));
      return;
    }

    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "refuse" })
        .eq("id", appointmentId);

      if (error) throw error;

      toast.success(t('appointments.cancelSuccess'));
      refetch();
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error(t('appointments.cancelError'));
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

  if (!selectedConsulate || !selectedService) {
    return (
      <Card className="border-none shadow-none">
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            {t('dashboard.selectPrompt')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">{t('dashboard.newAppointment')}</CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentForm 
            onSuccess={refetch} 
            selectedConsulate={selectedConsulate}
            selectedService={selectedService}
          />
        </CardContent>
      </Card>

      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">{t('dashboard.myAppointments')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-2 mb-4 sm:mb-0">
                  <h3 className="text-lg font-medium">{appointment.title}</h3>
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
                <div className="flex flex-col space-y-2">
                  {getStatusBadge(appointment.status)}
                  {appointment.status !== "refuse" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelAppointment(appointment.id, appointment.date)}
                      className="mt-2"
                    >
                      {t('appointments.cancel')}
                    </Button>
                  )}
                </div>
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
    </div>
  );
};

export default ClientDashboard;