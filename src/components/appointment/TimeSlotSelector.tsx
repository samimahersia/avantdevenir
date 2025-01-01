import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAvailableSlots } from "@/hooks/use-available-slots";
import { TimeSlot } from "@/utils/appointment";
import SlotGrid from "./SlotGrid";
import SlotStatus from "./SlotStatus";

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
  const { 
    availableSlots, 
    isLoading, 
    holiday,
    error 
  } = useAvailableSlots(selectedDate, consulateId, serviceId, timeSlots);

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

  const dayOfWeek = selectedDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 1) {
    return (
      <div className="space-y-2">
        <Label>Heure du rendez-vous *</Label>
        <p className="text-center text-muted-foreground">
          Les rendez-vous ne sont disponibles que du mardi au samedi
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Label>Heure du rendez-vous *</Label>
        <p className="text-center text-red-500">
          Une erreur est survenue lors de la vérification des disponibilités
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Heure du rendez-vous * (9h00 - 14h00)</Label>
      <SlotStatus 
        isLoading={isLoading} 
        holiday={holiday} 
        availableSlots={availableSlots} 
      />
      {!isLoading && !holiday && availableSlots.length > 0 && (
        <SlotGrid 
          availableSlots={availableSlots}
          selectedTime={selectedTime}
          onTimeSelect={onTimeSelect}
        />
      )}
    </div>
  );
};

export default TimeSlotSelector;