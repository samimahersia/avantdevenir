import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TimeSlot {
  hour: number;
  minute: number;
}

interface TimeSlotSelectorProps {
  selectedTime?: TimeSlot;
  onTimeSelect: (time: TimeSlot) => void;
  timeSlots: TimeSlot[];
  selectedDate: Date;
  consulateId?: string;
}

const TimeSlotSelector = ({ 
  selectedTime, 
  onTimeSelect, 
  timeSlots,
  selectedDate,
  consulateId 
}: TimeSlotSelectorProps) => {
  const dayOfWeek = selectedDate.getDay();
  // Convert Sunday (0) to 7 to match our database convention
  const adjustedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

  const { data: availabilities = [] } = useQuery({
    queryKey: ["recurring-availabilities", consulateId, adjustedDayOfWeek],
    queryFn: async () => {
      if (!consulateId) return [];
      
      const { data, error } = await supabase
        .from("recurring_availabilities")
        .select("*")
        .eq("consulate_id", consulateId)
        .eq("day_of_week", adjustedDayOfWeek);

      if (error) {
        console.error("Error fetching availabilities:", error);
        return [];
      }

      return data;
    },
    enabled: !!consulateId
  });

  const isTimeSlotAvailable = (slot: TimeSlot) => {
    if (!availabilities.length) return false;

    return availabilities.some(availability => 
      slot.hour >= availability.start_hour && 
      slot.hour < availability.end_hour
    );
  };

  const availableTimeSlots = timeSlots.filter(isTimeSlotAvailable);

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