import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppointmentForm from "./AppointmentForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import AppointmentList from "./appointment/AppointmentList";
import PDFExportButton from "./appointment/PDFExportButton";
import MessageForm from "./MessageForm";

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

  return (
    <div className="space-y-6 md:space-y-8">
      <Card className="border-none shadow-none">
        <CardHeader className="px-4 md:px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl md:text-2xl font-semibold">
              {t('dashboard.myAppointments')}
            </CardTitle>
            <PDFExportButton appointments={appointments} />
          </div>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <AppointmentList 
            appointments={appointments}
            onCancel={handleCancel}
          />
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
            <CardTitle className="text-xl md:text-2xl font-semibold">
              {t('dashboard.newAppointment')}
            </CardTitle>
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

      <Card className="border-none shadow-none">
        <CardContent className="px-4 md:px-6">
          <MessageForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;