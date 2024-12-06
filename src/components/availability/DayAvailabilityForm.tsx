import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleHourChange = (
    type: "startHour" | "endHour",
    hour: number
  ) => {
    if (!availability) {
      onAvailabilityChange({
        startHour: type === "startHour" ? hour : 0,
        endHour: type === "endHour" ? hour : 0
      });
      return;
    }

    onAvailabilityChange({
      ...availability,
      [type]: hour,
    });
  };

  const handleSave = async () => {
    if (!selectedOrganismee) {
      toast.error("Veuillez sélectionner un organisme");
      return;
    }

    if (!availability) return;

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

      // First, get all existing records for this day and consulate
      const { data: existingRecords, error: fetchError } = await supabase
        .from("recurring_availabilities")
        .select("*")
        .eq("consulate_id", selectedOrganismee)
        .eq("day_of_week", dayIndex);

      if (fetchError) {
        console.error("Error checking existing availabilities:", fetchError);
        throw fetchError;
      }

      // Delete all existing records for this day and consulate
      if (existingRecords && existingRecords.length > 0) {
        const { error: deleteError } = await supabase
          .from("recurring_availabilities")
          .delete()
          .eq("consulate_id", selectedOrganismee)
          .eq("day_of_week", dayIndex);

        if (deleteError) {
          console.error("Error deleting existing availabilities:", deleteError);
          throw deleteError;
        }
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

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-medium text-lg">{day}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Heure de début</Label>
          <select
            className="w-full border rounded-md p-2"
            value={availability?.startHour ?? ""}
            onChange={(e) =>
              handleHourChange("startHour", parseInt(e.target.value))
            }
          >
            <option value="">Sélectionner une heure</option>
            {HOURS.map((hour) => (
              <option key={hour} value={hour}>
                {hour}:00
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Heure de fin</Label>
          <select
            className="w-full border rounded-md p-2"
            value={availability?.endHour ?? ""}
            onChange={(e) =>
              handleHourChange("endHour", parseInt(e.target.value))
            }
          >
            <option value="">Sélectionner une heure</option>
            {HOURS.map((hour) => (
              <option
                key={hour}
                value={hour}
                disabled={hour <= (availability?.startHour ?? -1)}
              >
                {hour}:00
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button
        onClick={handleSave}
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