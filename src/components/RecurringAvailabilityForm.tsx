import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { OrganismeeSelector } from "./OrganismeeSelector";
import { useQuery } from "@tanstack/react-query";

const DAYS_OF_WEEK = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const RecurringAvailabilityForm = () => {
  const [selectedOrganismee, setSelectedOrganismee] = useState<string>("");
  const [availabilities, setAvailabilities] = useState<{
    [key: number]: { startHour: number; endHour: number };
  }>({});

  const { data: existingAvailabilities = [], refetch } = useQuery({
    queryKey: ["recurring-availabilities", selectedOrganismee],
    queryFn: async () => {
      if (!selectedOrganismee) return [];
      
      const { data, error } = await supabase
        .from("recurring_availabilities")
        .select("*")
        .eq("consulate_id", selectedOrganismee);

      if (error) throw error;
      return data;
    },
    enabled: !!selectedOrganismee,
    onSuccess: (data) => {
      const newAvailabilities = data.reduce((acc, curr) => ({
        ...acc,
        [curr.day_of_week]: {
          startHour: curr.start_hour,
          endHour: curr.end_hour
        }
      }), {});
      setAvailabilities(newAvailabilities);
    }
  });

  const handleHourChange = (
    dayIndex: number,
    type: "startHour" | "endHour",
    hour: number
  ) => {
    setAvailabilities((prev) => ({
      ...prev,
      [dayIndex]: {
        ...prev[dayIndex],
        [type]: hour,
      },
    }));
  };

  const handleSave = async (dayIndex: number) => {
    if (!selectedOrganismee) {
      toast.error("Veuillez sélectionner un organisme");
      return;
    }

    const availability = availabilities[dayIndex];
    if (!availability) return;

    try {
      const existingAvailability = existingAvailabilities.find(
        a => a.day_of_week === dayIndex
      );

      const { error } = await supabase.from("recurring_availabilities").upsert({
        id: existingAvailability?.id,
        day_of_week: dayIndex,
        start_hour: availability.startHour,
        end_hour: availability.endHour,
        consulate_id: selectedOrganismee,
      });

      if (error) throw error;
      
      toast.success("Disponibilités mises à jour");
      refetch();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors de la mise à jour des disponibilités");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des disponibilités récurrentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="mb-6">
          <Label>Organisme</Label>
          <OrganismeeSelector
            value={selectedOrganismee}
            onValueChange={setSelectedOrganismee}
          />
        </div>

        {DAYS_OF_WEEK.map((day, index) => (
          <div key={day} className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-medium text-lg">{day}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Heure de début</Label>
                <select
                  className="w-full border rounded-md p-2"
                  value={availabilities[index]?.startHour ?? ""}
                  onChange={(e) =>
                    handleHourChange(index, "startHour", parseInt(e.target.value))
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
                  value={availabilities[index]?.endHour ?? ""}
                  onChange={(e) =>
                    handleHourChange(index, "endHour", parseInt(e.target.value))
                  }
                >
                  <option value="">Sélectionner une heure</option>
                  {HOURS.map((hour) => (
                    <option
                      key={hour}
                      value={hour}
                      disabled={hour <= (availabilities[index]?.startHour ?? -1)}
                    >
                      {hour}:00
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button
              onClick={() => handleSave(index)}
              disabled={
                !selectedOrganismee ||
                !availabilities[index]?.startHour ||
                !availabilities[index]?.endHour
              }
              className="w-full md:w-auto"
            >
              Enregistrer
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecurringAvailabilityForm;