import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AppointmentDetailsProps {
  appointment: {
    consulates?: { name: string };
    services?: { name: string };
    date: string;
    profiles?: {
      first_name: string;
      last_name: string;
    };
    title: string;
    description?: string;
  };
}

export const AppointmentDetails = ({ appointment }: AppointmentDetailsProps) => {
  const formatDate = (date: string) => {
    return format(new Date(date), "d MMMM yyyy 'à' HH'h'mm", { locale: fr });
  };

  return (
    <div className="space-y-2 flex-grow">
      {/* Établissement */}
      <div className="text-left">
        <p className="font-bold text-lg text-gray-900">{appointment.consulates?.name}</p>
      </div>
      
      {/* Service */}
      <div className="text-left">
        <p className="font-bold text-gray-900">{appointment.services?.name}</p>
      </div>
      
      {/* Date et heure */}
      <div className="text-left">
        <p className="font-bold text-gray-900">{formatDate(appointment.date)}</p>
      </div>
      
      {/* Nom et prénom */}
      <div className="text-left">
        <p className="font-bold text-gray-900">
          {appointment.profiles?.first_name} {appointment.profiles?.last_name}
        </p>
      </div>
      
      {/* Titre */}
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
  );
};