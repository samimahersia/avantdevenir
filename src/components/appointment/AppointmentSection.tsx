import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppointmentList from "./AppointmentList";
import PDFExportButton from "./PDFExportButton";
import { useTranslation } from "react-i18next";

interface Appointment {
  id: string;
  [key: string]: any;
}

interface AppointmentSectionProps {
  appointments: Appointment[];
  onCancel: (appointmentId: string) => void;
}

const AppointmentSection = ({ appointments, onCancel }: AppointmentSectionProps) => {
  const { t } = useTranslation();

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-4 md:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl md:text-2xl font-semibold">
            {t('dashboard.myAppointments')}
          </CardTitle>
          <PDFExportButton appointments={appointments} />
        </div>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <AppointmentList 
          appointments={appointments}
          onCancel={onCancel}
        />
      </CardContent>
    </Card>
  );
};

export default AppointmentSection;