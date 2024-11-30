import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AppointmentForm from "./AppointmentForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ClientDashboardProps {
  selectedConsulate?: string;
  selectedService?: string;
}

const ClientDashboard = ({ selectedConsulate, selectedService }: ClientDashboardProps) => {
  const { data: appointments = [], refetch } = useQuery({
    queryKey: ["appointments", selectedConsulate],
    queryFn: async () => {
      const query = supabase
        .from("appointments")
        .select("*, services(name)")
        .order("date", { ascending: true });

      if (selectedConsulate) {
        query.eq("consulate_id", selectedConsulate);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedConsulate
  });

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

  if (!selectedConsulate || !selectedService) {
    return (
      <Card className="border-none shadow-none">
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Veuillez sélectionner un consulat et un service pour prendre rendez-vous.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Nouveau Rendez-vous</CardTitle>
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
          <CardTitle className="text-2xl font-semibold">Mes Rendez-vous</CardTitle>
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
                    Service : {appointment.services?.name}
                  </p>
                  {appointment.description && (
                    <p className="text-sm text-muted-foreground">{appointment.description}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(appointment.date), "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr })}
                  </p>
                </div>
                {getStatusBadge(appointment.status)}
              </div>
            ))}
            {appointments.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Vous n'avez pas encore de rendez-vous.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;