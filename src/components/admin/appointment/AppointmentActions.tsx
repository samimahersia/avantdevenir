import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AppointmentActionsProps {
  status: string;
  onStatusChange: (status: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const AppointmentActions = ({
  status,
  onStatusChange,
  onEdit,
  onDelete,
}: AppointmentActionsProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approuve":
        return <Badge className="bg-green-500 hover:bg-green-600">Approuvé</Badge>;
      case "refuse":
        return <Badge className="bg-red-500 hover:bg-red-600">Refusé</Badge>;
      default:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">En attente</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-3 ml-6">
      {getStatusBadge(status)}
      <div className="flex flex-col gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onEdit}
          className="w-full"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Modifier
        </Button>
        
        {status === "en_attente" && (
          <>
            <Button
              size="sm"
              variant="default"
              className="w-full bg-green-500 hover:bg-green-600"
              onClick={() => onStatusChange("approuve")}
            >
              Approuver
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="w-full"
              onClick={() => onStatusChange("refuse")}
            >
              Refuser
            </Button>
          </>
        )}
        
        <Button
          size="sm"
          variant="destructive"
          className="w-full"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </Button>
      </div>
    </div>
  );
};