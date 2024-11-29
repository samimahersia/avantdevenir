import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import AppointmentStats from "./AppointmentStats";
import RecurringAvailabilityForm from "./RecurringAvailabilityForm";

const AdminDashboard = () => {
  const [showStats, setShowStats] = useState(false);
  const [showAvailabilities, setShowAvailabilities] = useState(false);

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
      const { error } = await supabase
        .from("appointments")
        .update({ status: newStatus })
        .eq("id", appointmentId);

      if (error) throw error;

      // Send email notification
      const { error: notificationError } = await supabase.functions.invoke("send-appointment-notification", {
        body: { appointmentId, type: "status_update" }
      });

      if (notificationError) {
        console.error("Failed to send notification:", notificationError);
        toast.error("Le statut a été mis à jour mais l'email n'a pas pu être envoyé");
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
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl font-semibold">Tableau de bord administrateur</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              setShowStats(false);
              setShowAvailabilities(!showAvailabilities);
            }}
          >
            {showAvailabilities ? "Voir les rendez-vous" : "Gérer les disponibilités"}
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              setShowAvailabilities(false);
              setShowStats(!showStats);
            }}
          >
            {showStats ? "Voir les rendez-vous" : "Voir les statistiques"}
          </Button>
        </div>
      </div>

      {showStats ? (
        <AppointmentStats />
      ) : showAvailabilities ? (
        <RecurringAvailabilityForm />
      ) : (
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Gestion des Rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-6 border rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2 mb-4 md:mb-0">
                    <h3 className="text-lg font-medium">{appointment.title}</h3>
                    {appointment.description && (
                      <p className="text-sm text-muted-foreground">{appointment.description}</p>
                    )}
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="font-medium">Client:</span> 
                        {appointment.profiles?.first_name} {appointment.profiles?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="font-medium">Date:</span>
                        {format(new Date(appointment.date), "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {getStatusBadge(appointment.status)}
                    {appointment.status === "en_attente" && (
                      <div className="flex gap-2">
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;