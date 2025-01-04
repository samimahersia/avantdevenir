import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { X } from "lucide-react";

interface AppointmentCardProps {
  appointment: any;
  onCancel: (id: string) => void;
}

const AppointmentCard = ({ appointment, onCancel }: AppointmentCardProps) => {
  const canModifyAppointment = (appointment: any) => {
    return appointment.status === "en_attente" && new Date(appointment.date) > new Date();
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
    <div className="flex flex-col p-4 md:p-6 border rounded-xl bg-white dark:bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-2 text-left">
        <p className="font-bold text-gray-900">{appointment.consulates?.name}</p>
        <p className="font-bold text-gray-900">Service : {appointment.services?.name}</p>
        <p className="text-sm text-gray-600">
          {format(new Date(appointment.date), "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr })}
        </p>
        <p className="text-sm text-gray-600">
          {appointment.profiles?.first_name} {appointment.profiles?.last_name}
        </p>
        <p className="text-sm text-gray-600">Titre : {appointment.title} *</p>
      </div>
      <div className="flex justify-between items-center mt-4">
        {getStatusBadge(appointment.status)}
        {canModifyAppointment(appointment) && (
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => onCancel(appointment.id)}
          >
            <X className="h-4 w-4 mr-2" />
            <span>Annuler</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;