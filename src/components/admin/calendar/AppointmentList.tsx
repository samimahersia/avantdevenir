import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface AppointmentListProps {
  appointments: any[];
  selectedDate: Date;
}

const AppointmentList = ({ appointments, selectedDate }: AppointmentListProps) => {
  const selectedDayAppointments = appointments.filter(
    (appointment) => format(new Date(appointment.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  );

  return (
    <div className="space-y-4">
      {selectedDayAppointments.length === 0 ? (
        <p className="text-muted-foreground">Aucun rendez-vous ce jour</p>
      ) : (
        selectedDayAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="p-4 border rounded-lg space-y-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{appointment.title}</h3>
              <Badge
                variant={
                  appointment.status === "approuve"
                    ? "success"
                    : appointment.status === "refuse"
                    ? "destructive"
                    : "secondary"
                }
              >
                {appointment.status === "approuve"
                  ? "Approuvé"
                  : appointment.status === "refuse"
                  ? "Refusé"
                  : "En attente"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(appointment.date), "HH'h'mm", { locale: fr })} - {appointment.profiles?.first_name} {appointment.profiles?.last_name}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default AppointmentList;