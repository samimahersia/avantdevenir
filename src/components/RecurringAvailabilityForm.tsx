import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { OrganismeeSelector } from "./OrganismeeSelector";
import { useQuery } from "@tanstack/react-query";
import { DayAvailabilityForm } from "./availability/DayAvailabilityForm";

const DAYS_OF_WEEK = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const RecurringAvailabilityForm = () => {
  const [selectedOrganismee, setSelectedOrganismee] = useState<string>("");
  const [availabilities, setAvailabilities] = useState<{
    [key: number]: { startHour: number; endHour: number };
  }>({});

  const { data: existingAvailabilities = [], refetch } = useQuery({
    queryKey: ["recurring-availabilities", selectedOrganismee],
    queryFn: async () => {
      if (!selectedOrganismee) return [];
      
      console.log("Fetching existing availabilities for organisme:", selectedOrganismee);
      
      const { data, error } = await supabase
        .from("recurring_availabilities")
        .select("*")
        .eq("consulate_id", selectedOrganismee);

      if (error) {
        console.error("Error fetching availabilities:", error);
        toast.error("Erreur lors du chargement des disponibilités");
        throw error;
      }

      console.log("Fetched availabilities:", data);
      return data || [];
    },
    enabled: !!selectedOrganismee,
    meta: {
      onSettled: (data) => {
        if (data) {
          const newAvailabilities = data.reduce((acc, curr) => ({
            ...acc,
            [curr.day_of_week]: {
              startHour: curr.start_hour,
              endHour: curr.end_hour
            }
          }), {});
          setAvailabilities(newAvailabilities);
        }
      }
    }
  });

  const handleOrganismeeChange = (value: string) => {
    setSelectedOrganismee(value);
    setAvailabilities({}); // Reset availabilities when changing organisme
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
            onValueChange={handleOrganismeeChange}
          />
        </div>

        {DAYS_OF_WEEK.map((day, index) => (
          <DayAvailabilityForm
            key={day}
            day={day}
            dayIndex={index + 1}
            selectedOrganismee={selectedOrganismee}
            availability={availabilities[index + 1]}
            onAvailabilityChange={(newAvailability) => {
              setAvailabilities(prev => ({
                ...prev,
                [index + 1]: newAvailability
              }));
            }}
            refetchAvailabilities={refetch}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default RecurringAvailabilityForm;