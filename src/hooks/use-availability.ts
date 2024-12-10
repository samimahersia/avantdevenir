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
      console.log("Saving availability for day", dayIndex, ":", availability);

      // Vérifier si une disponibilité existe déjà pour ce jour et cet organisme
      const { data: existingAvailabilities, error: fetchError } = await supabase
        .from("recurring_availabilities")
        .select("*")
        .eq("consulate_id", selectedOrganismee)
        .eq("day_of_week", dayIndex);

      if (fetchError) {
        console.error("Error fetching existing availability:", fetchError);
        throw fetchError;
      }

      const existingAvailability = existingAvailabilities?.[0];

      if (existingAvailability) {
        // Mettre à jour la disponibilité existante
        const { error: updateError } = await supabase
          .from("recurring_availabilities")
          .update({
            start_hour: availability.startHour,
            end_hour: availability.endHour,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingAvailability.id);

        if (updateError) {
          console.error("Error updating availability:", updateError);
          throw updateError;
        }
      } else {
        // Insérer une nouvelle disponibilité
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