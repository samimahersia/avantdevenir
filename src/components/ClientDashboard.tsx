import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppointmentForm from "./AppointmentForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import AppointmentList from "./appointment/AppointmentList";
import PDFExportButton from "./appointment/PDFExportButton";
import MessageForm from "./MessageForm";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

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

  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ["client-messages"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user.id) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("client_id", session.session.user.id)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching messages:", error);
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

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId);

      if (error) {
        console.error("Error deleting message:", error);
        toast.error("Erreur lors de la suppression du message");
        return;
      }

      toast.success("Message supprimé avec succès");
      refetchMessages();
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
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-xl md:text-2xl font-semibold">
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6 space-y-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="p-4 rounded-lg border bg-card">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(message.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteMessage(message.id)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm">{message.content}</p>
                  {message.admin_response && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium">Réponse de l'administrateur:</p>
                      <p className="text-sm mt-1">{message.admin_response}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-center text-muted-foreground">
                Aucun message
              </p>
            )}
          </div>
          <MessageForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
