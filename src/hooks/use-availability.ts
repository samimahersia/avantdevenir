import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UseAvailabilityProps {
  dayIndex: number;
  selectedOrganismee: string;
  refetchAvailabilities: () => void;
}

export const useAvailability = ({
  dayIndex,
  selectedOrganismee,
  refetchAvailabilities,
}: UseAvailabilityProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (availability: { startHour: number; endHour: number }) => {
    if (!selectedOrganismee) {
      toast.error("Veuillez sélectionner un organisme");
      return;
    }

    if (availability.startHour >= availability.endHour) {
      toast.error("L'heure de début doit être inférieure à l'heure de fin");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Saving availability:", {
        dayIndex,
        availability,
        selectedOrganismee
      });

      // Delete existing records for this day and consulate
      const { error: deleteError } = await supabase
        .from("recurring_availabilities")
        .delete()
        .eq("consulate_id", selectedOrganismee)
        .eq("day_of_week", dayIndex);

      if (deleteError) {
        console.error("Error deleting existing availabilities:", deleteError);
        throw deleteError;
      }

      // Insert the new record
      const { error: insertError } = await supabase
        .from("recurring_availabilities")
        .insert([{
          day_of_week: dayIndex,
          start_hour: availability.startHour,
          end_hour: availability.endHour,
          consulate_id: selectedOrganismee,
        }]);

      if (insertError) {
        console.error("Error saving availability:", insertError);
        throw insertError;
      }

      toast.success("Disponibilités mises à jour");
      refetchAvailabilities();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors de la mise à jour des disponibilités");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSave,
  };
};