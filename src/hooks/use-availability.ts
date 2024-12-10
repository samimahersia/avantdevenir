import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

      // Vérifier s'il existe des jours fériés pour cet organisme
      const { data: holidays, error: holidaysError } = await supabase
        .from("consulate_holidays")
        .select("*")
        .eq("consulate_id", selectedOrganismee);

      if (holidaysError) {
        console.error("Error fetching holidays:", holidaysError);
        throw holidaysError;
      }

      // Si des jours fériés existent pour ce jour de la semaine, afficher un avertissement
      if (holidays && holidays.some(holiday => {
        const holidayDate = new Date(holiday.date);
        return holidayDate.getDay() === (dayIndex % 7);
      })) {
        toast.warning("Attention : Il existe des jours fériés configurés pour ce jour de la semaine");
      }

      if (existingAvailabilities && existingAvailabilities.length > 0) {
        // Mettre à jour la disponibilité existante
        const { error: updateError } = await supabase
          .from("recurring_availabilities")
          .update({
            start_hour: availability.startHour,
            end_hour: availability.endHour,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingAvailabilities[0].id);

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
      toast.success("Disponibilités enregistrées avec succès");
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast.error("Erreur lors de l'enregistrement des disponibilités");
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