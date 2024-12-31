import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { EditAppointmentForm } from "./EditAppointmentForm";

interface AppointmentCardProps {
  appointment: any;
  onStatusChange: (appointmentId: string, newStatus: string) => Promise<void>;
  onDelete: (appointmentId: string) => Promise<void>;
  onEdit: (appointmentId: string, data: { title: string; description: string }) => Promise<void>;
}

export const AppointmentCard = ({ 
  appointment, 
  onStatusChange, 
  onDelete,
  onEdit 
}: AppointmentCardProps) => {
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    <div className="flex flex-col p-6 border rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium">{appointment.title}</h3>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le rendez-vous</DialogTitle>
              </DialogHeader>
              <EditAppointmentForm
                appointment={appointment}
                onSubmit={async (data) => {
                  await onEdit(appointment.id, data);
                  setIsDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(appointment.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {appointment.description && (
        <p className="text-sm text-muted-foreground mb-4">
          {appointment.description}
        </p>
      )}
      
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Client:</span> 
            {appointment.profiles?.first_name} {appointment.profiles?.last_name}
          </p>
          {getStatusBadge(appointment.status)}
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Date:</span>{" "}
          {format(new Date(appointment.date), "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr })}
        </p>
        <p className="text-sm text-blue-800 font-medium">
          {appointment.consulates?.name}
        </p>
      </div>

      {appointment.status === "en_attente" && (
        <div className={`flex gap-2 ${isMobile ? 'mt-4' : 'mb-4'}`}>
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
            onClick={() => onStatusChange(appointment.id, "approuve")}
          >
            <Check className="w-4 h-4 mr-1" />
            Approuver
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => onStatusChange(appointment.id, "refuse")}
          >
            <X className="w-4 h-4 mr-1" />
            Refuser
          </Button>
        </div>
      )}
    </div>
  );
};