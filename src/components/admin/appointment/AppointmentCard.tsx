import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { EditAppointmentForm } from "./EditAppointmentForm";
import { AppointmentDetails } from "./AppointmentDetails";
import { AppointmentActions } from "./AppointmentActions";

interface AppointmentCardProps {
  appointment: any;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: { title: string; description: string }) => void;
  isMobile?: boolean;
}

export const AppointmentCard = ({
  appointment,
  onStatusChange,
  onDelete,
  onEdit,
  isMobile = false
}: AppointmentCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = async (data: { title: string; description: string }) => {
    await onEdit(appointment.id, data);
    setIsEditing(false);
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between">
          <AppointmentDetails appointment={appointment} />
          <AppointmentActions
            status={appointment.status}
            onStatusChange={(status) => onStatusChange(appointment.id, status)}
            onEdit={() => setIsEditing(true)}
            onDelete={() => onDelete(appointment.id)}
          />
        </div>
      </CardContent>
      
      {isEditing && (
        <EditAppointmentForm
          appointment={appointment}
          onEdit={handleEdit}
          onClose={() => setIsEditing(false)}
        />
      )}
    </Card>
  );
};