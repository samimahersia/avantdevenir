import { Label } from "@/components/ui/label";

// Generate hours from 9 to 14 only
const HOURS = Array.from({ length: 15 }, (_, i) => i + 9);

interface TimeRangeSelectorProps {
  startHour: number | undefined;
  endHour: number | undefined;
  onStartHourChange: (hour: number) => void;
  onEndHourChange: (hour: number) => void;
}

export const TimeRangeSelector = ({
  startHour,
  endHour,
  onStartHourChange,
  onEndHourChange,
}: TimeRangeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Heure de début</Label>
        <select
          className="w-full border rounded-md p-2 bg-white text-black"
          value={startHour ?? ""}
          onChange={(e) => onStartHourChange(parseInt(e.target.value))}
        >
          <option value="">Sélectionner une heure</option>
          {HOURS.map((hour) => (
            <option key={hour} value={hour}>
              {hour.toString().padStart(2, '0')}:00
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label>Heure de fin</Label>
        <select
          className="w-full border rounded-md p-2 bg-white text-black"
          value={endHour ?? ""}
          onChange={(e) => onEndHourChange(parseInt(e.target.value))}
        >
          <option value="">Sélectionner une heure</option>
          {HOURS.map((hour) => (
            <option
              key={hour}
              value={hour}
              disabled={hour <= (startHour ?? -1)}
            >
              {hour.toString().padStart(2, '0')}:00
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};