import { useState } from "react";
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
    setIsSubmitting(true);
    try {
      console.log("Saving availability:", {
        dayIndex,
        selectedOrganismee,
        availability
      });

      // Supprimer les disponibilités existantes pour ce jour et cet organisme
      const { error: deleteError } = await supabase
        .from("recurring_availabilities")
        .delete()
        .eq("consulate_id", selectedOrganismee)
        .eq("day_of_week", dayIndex);

      if (deleteError) {
        console.error("Error deleting existing availabilities:", deleteError);
        throw deleteError;
      }

      // Insérer la nouvelle disponibilité
      const { error: insertError } = await supabase
        .from("recurring_availabilities")
        .insert([
          {
            day_of_week: dayIndex,
            start_hour: availability.startHour,
            end_hour: availability.endHour,
            consulate_id: selectedOrganismee,
          },
        ]);

      if (insertError) {
        console.error("Error inserting availability:", insertError);
        throw insertError;
      }

      await refetchAvailabilities();
    } catch (error) {
      console.error("Error in handleSave:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSave,
  };
};