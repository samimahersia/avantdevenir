import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AppointmentCard } from "./appointment/AppointmentCard";

const AppointmentManagement = () => {
  const { data: appointments = [], refetch } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          profiles(first_name, last_name),
          consulates(name)
        `)
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

      const { error: notificationError } = await supabase.functions.invoke("send-notification", {
        body: {
          userId: appointment.client_id,
          type: "appointment_status",
          title: `Rendez-vous ${newStatus === "approuve" ? "approuvé" : "refusé"}`,
          content: `Votre rendez-vous du ${new Date(appointment.date).toLocaleDateString('fr-FR')} a été ${newStatus === "approuve" ? "approuvé" : "refusé"}.`,
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

  const handleDelete = async (appointmentId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", appointmentId);

      if (error) throw error;

      toast.success("Rendez-vous supprimé avec succès");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la suppression du rendez-vous");
    }
  };

  const handleEdit = async (appointmentId: string, data: { title: string; description: string }) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          title: data.title,
          description: data.description,
        })
        .eq("id", appointmentId);

      if (error) throw error;

      toast.success("Rendez-vous modifié avec succès");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la modification du rendez-vous");
    }
  };

  return (
    <Card className="mt-auto">
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentManagement;