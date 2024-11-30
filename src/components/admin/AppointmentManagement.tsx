import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const AppointmentManagement = () => {
  const isMobile = useIsMobile();
  const { data: appointments = [], refetch } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*, profiles(first_name, last_name)")
        .order("date", { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const { data: appointment, error: fetchError } = await supabase
        .from("appointments")
        .select("client_id, date")
        .eq("id", appointmentId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from("appointments")
        .update({ status: newStatus })
        .eq("id", appointmentId);

      if (error) throw error;

      // Send notification
      const { error: notificationError } = await supabase.functions.invoke("send-notification", {
        body: {
          userId: appointment.client_id,
          type: "appointment_status",
          title: `Rendez-vous ${newStatus === "approuve" ? "approuvé" : "refusé"}`,
          content: `Votre rendez-vous du ${format(new Date(appointment.date), "d MMMM yyyy 'à' HH:mm", { locale: fr })} a été ${newStatus === "approuve" ? "approuvé" : "refusé"}.`,
          metadata: {
            appointmentId,
            status: newStatus,
          },
        },
      });

      if (notificationError) {
        console.error("Failed to send notification:", notificationError);
        toast.error("Le statut a été mis à jour mais la notification n'a pas pu être envoyée");
      } else {
        toast.success(`Rendez-vous ${newStatus === "approuve" ? "approuvé" : "refusé"}`);
      }

      refetch();
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_attente":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">En attente</Badge>;
      case "approuve":
        return <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Approuvé</Badge>;
      case "refuse":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Refusé</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="mt-auto">
      <CardHeader>
        <CardTitle>Gestion des Rendez-vous</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex flex-col p-6 border rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium">{appointment.title}</h3>
              </div>
              
              {appointment.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {appointment.description}
                </p>
              )}
              
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Client:</span> 
                    {appointment.profiles?.first_name} {appointment.profiles?.last_name}
                  </p>
                  {getStatusBadge(appointment.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Date:</span>
                  {format(new Date(appointment.date), "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr })}
                </p>
              </div>

              {appointment.status === "en_attente" && (
                <div className={`flex gap-2 ${isMobile ? 'mt-4' : 'mb-4'}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                    onClick={() => handleStatusChange(appointment.id, "approuve")}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approuver
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => handleStatusChange(appointment.id, "refuse")}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Refuser
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentManagement;