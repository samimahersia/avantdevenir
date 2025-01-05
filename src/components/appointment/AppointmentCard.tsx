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
      <div className="flex justify-between">
        <div className="space-y-3 flex-grow">
          {/* Établissement */}
          <div className="text-left">
            <p className="font-bold text-gray-900">{appointment.consulates?.name}</p>
          </div>
          
          {/* Type de service */}
          <div className="text-left">
            <p className="font-bold text-gray-900">Service : {appointment.services?.name}</p>
          </div>

          {/* Date et heure */}
          <div className="text-left">
            <p className="font-bold text-gray-900">
              {format(new Date(appointment.date), "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr })}
            </p>
          </div>

          {/* Nom et prénom */}
          <div className="text-left">
            <p className="font-bold text-gray-900">
              {appointment.profiles?.first_name} {appointment.profiles?.last_name}
            </p>
          </div>

          {/* Motif */}
          <div className="text-left">
            <p className="text-gray-700">Titre : {appointment.title}</p>
          </div>

          {/* Description */}
          {appointment.description && (
            <div className="text-left">
              <p className="text-gray-700">Description : {appointment.description}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 ml-4">
          {getStatusBadge(appointment.status)}
          {canModifyAppointment(appointment) && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
              >
                Modifier
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => onCancel(appointment.id)}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;