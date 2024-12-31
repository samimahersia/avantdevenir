import { TimeSlot } from "@/utils/appointment";

interface SlotStatusProps {
  isLoading: boolean;
  holiday: any;
  availableSlots: TimeSlot[];
}

const SlotStatus = ({ isLoading, holiday, availableSlots }: SlotStatusProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-sm text-muted-foreground mt-2">Vérification des disponibilités...</p>
      </div>
    );
  }

  if (holiday) {
    return (
      <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-muted-foreground font-medium">
          L'organisme est fermé ce jour-là
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {holiday.description ? `Raison : ${holiday.description}` : "Jour férié"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Veuillez sélectionner une autre date
        </p>
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-muted-foreground">
          Aucun créneau disponible pour cette date
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Veuillez sélectionner une autre date
        </p>
      </div>
    );
  }

  return null;
};

export default SlotStatus;