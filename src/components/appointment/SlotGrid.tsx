import { Button } from "@/components/ui/button";
import { TimeSlot } from "@/utils/appointment";

interface SlotGridProps {
  availableSlots: TimeSlot[];
  selectedTime?: TimeSlot;
  onTimeSelect: (time: TimeSlot) => void;
}

const SlotGrid = ({ availableSlots, selectedTime, onTimeSelect }: SlotGridProps) => (
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
);

export default SlotGrid;