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

      // Vérifier si une disponibilité existe déjà pour ce jour et cet organisme
      const { data: existingAvailability, error: fetchError } = await supabase
        .from("recurring_availabilities")
        .select("*")
        .eq("consulate_id", selectedOrganismee)
        .eq("day_of_week", dayIndex)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
        console.error("Error fetching existing availability:", fetchError);
        throw fetchError;
      }

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
      toast.success("Disponibilités mises à jour avec succès");
    } catch (error) {
      console.error("Error in handleSave:", error);
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