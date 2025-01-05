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
    setIsEditing(false);
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div className="space-y-4 flex-grow">
            {/* Établissement */}
            <div>
              <p className="font-bold text-lg text-gray-900">{appointment.consulates?.name}</p>
            </div>
            
            {/* Service */}
            <div>
              <p className="font-bold text-gray-900">Service : {appointment.services?.name}</p>
            </div>
            
            {/* Date et heure */}
            <div>
              <p className="font-bold text-gray-900">{formatDate(appointment.date)}</p>
            </div>
            
            {/* Nom et prénom */}
            <div>
              <p className="font-bold text-gray-900">
                {appointment.profiles?.first_name} {appointment.profiles?.last_name}
              </p>
            </div>
            
            {/* Titre */}
            <div>
              <p className="text-gray-700">Titre : {appointment.title}</p>
            </div>
            
            {/* Description */}
            {appointment.description && (
              <div>
                <p className="text-gray-700">Description : {appointment.description}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 ml-6">
            <Badge className={`${getStatusColor(appointment.status)} mb-2`}>
              {appointment.status === "approuve"
                ? "Approuvé"
                : appointment.status === "refuse"
                ? "Refusé"
                : "En attente"}
            </Badge>
            
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="w-full"
              >
                Modifier
              </Button>
              
              {appointment.status === "en_attente" && (
                <>
                  <Button
                    size="sm"
                    variant="default"
                    className="w-full bg-green-500 hover:bg-green-600"
                    onClick={() => onStatusChange(appointment.id, "approuve")}
                  >
                    Approuver
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full"
                    onClick={() => onStatusChange(appointment.id, "refuse")}
                  >
                    Refuser
                  </Button>
                </>
              )}
              
              <Button
                size="sm"
                variant="destructive"
                className="w-full"
                onClick={() => onDelete(appointment.id)}
              >
                Supprimer
              </Button>
            </div>
          </div>
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