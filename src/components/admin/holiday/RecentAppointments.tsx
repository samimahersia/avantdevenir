import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Appointment {
  date: string;
  title: string;
}

interface RecentAppointmentsProps {
  appointments: Appointment[];
}

const RecentAppointments = ({ appointments }: RecentAppointmentsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Derniers créneaux</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {appointments.map((appointment, index) => (
            <div
              key={index}
              className="p-2 bg-gray-50 rounded-md"
            >
              <p className="font-medium">
                {format(new Date(appointment.date), "dd MMMM yyyy à HH:mm", { locale: fr })}
              </p>
              <p className="text-sm text-gray-600">{appointment.title}</p>
            </div>
          ))}
          {appointments.length === 0 && (
            <p className="text-gray-600 text-sm">Aucun rendez-vous récent</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAppointments;