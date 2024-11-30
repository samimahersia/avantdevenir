import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface TimeSlot {
  hour: number;
  minute: number;
}

interface TimeSlotSelectorProps {
  selectedTime?: TimeSlot;
  onTimeSelect: (time: TimeSlot) => void;
  timeSlots: TimeSlot[];
}

const TimeSlotSelector = ({ selectedTime, onTimeSelect, timeSlots }: TimeSlotSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Heure du rendez-vous *</Label>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {timeSlots.map((slot) => (
          <Button
            key={`${slot.hour}-${slot.minute}`}
            type="button"
            variant={selectedTime?.hour === slot.hour && selectedTime?.minute === slot.minute ? "default" : "outline"}
            onClick={() => onTimeSelect(slot)}
            className="w-full"
          >
            {slot.hour}:{slot.minute.toString().padStart(2, '0')}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotSelector;