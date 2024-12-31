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
  serviceId?: string;
}

const TimeSlotSelector = ({
  selectedTime,
  onTimeSelect,
  timeSlots,
  selectedDate,
  consulateId,
  serviceId
}: TimeSlotSelectorProps) => {
  // Vérifier si c'est un jour férié
  const { data: holiday, isLoading: isCheckingHoliday } = useQuery({
    queryKey: ["holiday-check", selectedDate, consulateId],
    queryFn: async () => {
      if (!selectedDate || !consulateId) return null;

      const { data, error } = await supabase
        .from("consulate_holidays")
        .select("*")
        .eq("consulate_id", consulateId)
        .eq("date", format(selectedDate, "yyyy-MM-dd"))
        .maybeSingle();

      if (error) {
        console.error("Error checking holiday:", error);
        return null;
      }

      return data;
    },
    enabled: !!selectedDate && !!consulateId
  });

  const { data: availableSlots = [], isLoading } = useQuery({
    queryKey: ["available-slots", selectedDate, consulateId, serviceId],
    queryFn: async () => {
      if (!selectedDate || !consulateId || !serviceId || holiday) return [];

      console.log("Fetching availabilities for consulate:", consulateId);
      
      // Convertir le jour JavaScript (0-6, Dimanche = 0) en jour de la semaine (1-7, Lundi = 1)
      const jsDay = selectedDate.getDay();
      const dayOfWeek = jsDay === 0 ? 7 : jsDay;
      
      console.log("Checking availability for:", {
        date: selectedDate,
        consulateId,
        serviceId,
        jsDay,
        convertedDayOfWeek: dayOfWeek
      });

      // Vérifier les disponibilités récurrentes d'abord
      const { data: recurringAvailabilities, error: recurringError } = await supabase
        .from("recurring_availabilities")
        .select("*")
        .eq("consulate_id", consulateId)
        .eq("day_of_week", dayOfWeek);

      console.log("Recurring availabilities found:", recurringAvailabilities);

      if (recurringError) {
        console.error("Error fetching recurring availabilities:", recurringError);
        return [];
      }

      const results = await Promise.all(
        timeSlots.map(async (slot) => {
          const slotDate = new Date(selectedDate);
          slotDate.setHours(slot.hour, slot.minute);

          const { data: isAvailable } = await supabase.rpc(
            'check_appointment_availability',
            {
              p_appointment_date: slotDate.toISOString(),
              p_service_id: serviceId,
              p_consulate_id: consulateId
            }
          );

          console.log("Slot availability check:", {
            slot: `${slot.hour}:${slot.minute}`,
            isAvailable
          });

          return {
            ...slot,
            isAvailable
          };
        })
      );

      return results.filter(slot => slot.isAvailable);
    },
    enabled: !!selectedDate && !!consulateId && !!serviceId && !holiday
  });

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

  if (!consulateId || !serviceId) {
    return (
      <div className="space-y-2">
        <Label>Heure du rendez-vous *</Label>
        <p className="text-center text-muted-foreground">
          Veuillez d'abord sélectionner un consulat et un service
        </p>
      </div>
    );
  }

  if (isCheckingHoliday || isLoading) {
    return (
      <div className="space-y-2">
        <Label>Heure du rendez-vous *</Label>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Vérification des disponibilités...</p>
        </div>
      </div>
    );
  }

  if (holiday) {
    return (
      <div className="space-y-2">
        <Label>Heure du rendez-vous *</Label>
        <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-muted-foreground font-medium">
            L'organisme est fermé ce jour-là
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {holiday.description ? `Raison : ${holiday.description}` : "Jour férié"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Veuillez sélectionner une autre date
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Heure du rendez-vous *</Label>
      {availableSlots.length > 0 ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {availableSlots.map((slot) => (
            <Button
              key={`${slot.hour}-${slot.minute}`}
              type="button"
              variant={selectedTime?.hour === slot.hour && selectedTime?.minute === slot.minute ? "default" : "outline"}
              onClick={() => onTimeSelect(slot)}
              className="w-full"
            >
              {slot.hour.toString().padStart(2, '0')}:{slot.minute.toString().padStart(2, '0')}
            </Button>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-muted-foreground">
            Aucun créneau disponible pour cette date
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Veuillez sélectionner une autre date
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;