import AppointmentCard from "./AppointmentCard";
import { useTranslation } from "react-i18next";

interface AppointmentListProps {
  appointments: any[];
  onCancel: (id: string) => void;
}

const AppointmentList = ({ appointments, onCancel }: AppointmentListProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onCancel={onCancel}
        />
      ))}
      {appointments.length === 0 && (
        <p className="text-center text-muted-foreground py-4">
          {t('dashboard.noAppointments')}
        </p>
      )}
    </div>
  );
};

export default AppointmentList;