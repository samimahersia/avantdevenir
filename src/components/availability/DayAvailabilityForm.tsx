import { Button } from "@/components/ui/button";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { useAvailability } from "@/hooks/use-availability";
import { toast } from "sonner";

interface DayAvailabilityFormProps {
  day: string;
  dayIndex: number;
  selectedOrganismee: string;
  availability?: {
    startHour: number;
    endHour: number;
  };
  onAvailabilityChange: (availability: { startHour: number; endHour: number }) => void;
  refetchAvailabilities: () => void;
}

export const DayAvailabilityForm = ({
  day,
  dayIndex,
  selectedOrganismee,
  availability,
  onAvailabilityChange,
  refetchAvailabilities
}: DayAvailabilityFormProps) => {
  const { isSubmitting, handleSave } = useAvailability({
    dayIndex,
    selectedOrganismee,
    refetchAvailabilities
  });

  const handleSubmit = async () => {
    if (!availability) {
      toast.error("Veuillez sélectionner les heures d'ouverture et de fermeture");
      return;
    }

    if (availability.startHour >= availability.endHour) {
      toast.error("L'heure de début doit être inférieure à l'heure de fin");
      return;
    }

    try {
      await handleSave(availability);
      toast.success(`Disponibilités enregistrées pour ${day}`);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Erreur lors de la sauvegarde des disponibilités");
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-medium text-lg">{day}</h3>
      
      <TimeRangeSelector
        startHour={availability?.startHour}
        endHour={availability?.endHour}
        onStartHourChange={(hour) => onAvailabilityChange({ 
          ...availability, 
          startHour: hour 
        })}
        onEndHourChange={(hour) => onAvailabilityChange({ 
          ...availability, 
          endHour: hour 
        })}
      />

      <Button
        onClick={handleSubmit}
        disabled={
          !selectedOrganismee ||
          !availability?.startHour ||
          !availability?.endHour ||
          isSubmitting
        }
        className="w-full md:w-auto"
      >
        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </div>
  );
};