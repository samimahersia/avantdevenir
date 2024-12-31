import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { EditAppointmentForm } from "./EditAppointmentForm";
import { useState } from "react";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approuve":
        return "bg-green-500 hover:bg-green-600";
      case "refuse":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-yellow-500 hover:bg-yellow-600";
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "PPP 'à' HH'h'mm", { locale: fr });
  };

  const handleEdit = async (data: { title: string; description: string }) => {
    await onEdit(appointment.id, data);
  };

  return (
    <Card className={`${isMobile ? 'p-2' : 'p-4'} shadow-sm`}>
      <CardContent className={`${isMobile ? 'p-2' : 'p-4'} space-y-4`}>
        <div className={`flex ${isMobile ? 'flex-col gap-2' : 'justify-between items-center'}`}>
          <div>
            <h3 className="font-semibold">{appointment.title}</h3>
            <p className="text-sm text-gray-500">
              {appointment.profiles?.first_name} {appointment.profiles?.last_name}
            </p>
            <p className="text-sm text-gray-500">{formatDate(appointment.date)}</p>
            {appointment.consulates?.name && (
              <p className="text-sm text-gray-500">{appointment.consulates.name}</p>
            )}
          </div>
          <div className={`flex ${isMobile ? 'flex-col' : 'gap-2'} items-start`}>
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status === "approuve"
                ? "Approuvé"
                : appointment.status === "refuse"
                ? "Refusé"
                : "En attente"}
            </Badge>
            <div className={`flex gap-2 ${isMobile ? 'mt-2 w-full' : ''}`}>
              {appointment.status === "en_attente" && (
                <>
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => onStatusChange(appointment.id, "approuve")}
                  >
                    Approuver
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onStatusChange(appointment.id, "refuse")}
                  >
                    Refuser
                  </Button>
                </>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Modifier
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(appointment.id)}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
        {appointment.description && (
          <p className="text-sm text-gray-600">{appointment.description}</p>
        )}
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