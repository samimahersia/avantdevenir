import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TimeSlot } from "@/utils/appointment";
import { format } from "date-fns";

interface TimeSlotSelectorProps {
  selectedTime?: TimeSlot;
  onTimeSelect: (time: TimeSlot) => void;
  timeSlots: TimeSlot[];
  selectedDate?: Date;
  consulateId?: string;
}

const TimeSlotSelector = ({ 
  selectedTime, 
  onTimeSelect, 
  timeSlots,
  selectedDate,
  consulateId 
}: TimeSlotSelectorProps) => {
  if (!selectedDate) {
    return (
      <div className="space-y-2">
        <Label>Heure du rendez-vous *</Label>
        <p className="text-center text-muted-foreground">
          Veuillez d'abord sélectionner une date
        </p>
      </div>
    );
  }

  if (!consulateId) {
    return (
      <div className="space-y-2">
        <Label>Heure du rendez-vous *</Label>
        <p className="text-center text-muted-foreground">
          Veuillez d'abord sélectionner un consulat
        </p>
      </div>
    );
  }

  // Get day of week (1-7, Monday-Sunday)
  const dayOfWeek = selectedDate.getDay() === 0 ? 7 : selectedDate.getDay();
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  console.log("Checking availability for:", {
    consulateId,
    dayOfWeek,
    date: formattedDate
  });

  const { data: availabilities = [], isLoading } = useQuery({
    queryKey: ["recurring-availabilities", consulateId, dayOfWeek, formattedDate],
    queryFn: async () => {
      console.log("Fetching availabilities for consulate:", consulateId);
      
      const { data: recurringAvailabilities, error: recurringError } = await supabase
        .from("recurring_availabilities")
        .select("*")
        .eq("consulate_id", consulateId)
        .eq("day_of_week", dayOfWeek);

      if (recurringError) {
        console.error("Error fetching recurring availabilities:", recurringError);
        throw recurringError;
      }

      console.log("Recurring availabilities found:", recurringAvailabilities);

      // Vérifier s'il y a des jours fériés
      const { data: holidays, error: holidayError } = await supabase
        .from("consulate_holidays")
        .select("*")
        .eq("consulate_id", consulateId)
        .eq("date", formattedDate);

      if (holidayError) {
        console.error("Error fetching holidays:", holidayError);
        throw holidayError;
      }

      // Si c'est un jour férié, retourner un tableau vide
      if (holidays && holidays.length > 0) {
        console.log("Holiday found for this date");
        return [];
      }

      return recurringAvailabilities || [];
    }
  });

  const isTimeSlotAvailable = (slot: TimeSlot) => {
    if (!availabilities.length) {
      console.log("No availabilities found for this day");
      return false;
    }

    const isAvailable = availabilities.some(availability => {
      const isInRange = slot.hour >= availability.start_hour && 
                       slot.hour < availability.end_hour;
      console.log(`Checking slot ${slot.hour}:${slot.minute} - In range: ${isInRange}`);
      return isInRange;
    });

    return isAvailable;
  };

  const availableTimeSlots = timeSlots.filter(isTimeSlotAvailable);
  console.log("Available time slots:", availableTimeSlots);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Heure du rendez-vous *</Label>
        <p className="text-center text-muted-foreground">
          Chargement des créneaux disponibles...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Heure du rendez-vous *</Label>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {availableTimeSlots.length > 0 ? (
          availableTimeSlots.map((slot) => (
            <Button
              key={`${slot.hour}-${slot.minute}`}
              type="button"
              variant={selectedTime?.hour === slot.hour && selectedTime?.minute === slot.minute ? "default" : "outline"}
              onClick={() => onTimeSelect(slot)}
              className="w-full"
            >
              {slot.hour}:{slot.minute.toString().padStart(2, '0')}
            </Button>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">
            Aucun créneau disponible pour cette date
          </p>
        )}
      </div>
    </div>
  );
};

export default TimeSlotSelector;