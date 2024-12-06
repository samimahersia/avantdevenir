import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TimeSlot } from "@/utils/appointment";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
  const { data: availableSlots = [], isLoading } = useQuery({
    queryKey: ["available-slots", selectedDate, consulateId, serviceId],
    queryFn: async () => {
      if (!selectedDate || !consulateId || !serviceId) return [];

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

          return {
            ...slot,
            isAvailable
          };
        })
      );

      return results.filter(slot => slot.isAvailable);
    },
    enabled: !!selectedDate && !!consulateId && !!serviceId
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

  return (
    <div className="space-y-2">
      <Label>Heure du rendez-vous *</Label>
      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Vérification des disponibilités...</p>
        </div>
      ) : availableSlots.length > 0 ? (
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