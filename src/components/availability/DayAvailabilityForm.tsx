import { Button } from "@/components/ui/button";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { useAvailability } from "@/hooks/use-availability";

interface DayAvailabilityFormProps {
  day: string;
  dayIndex: number;
  selectedOrganismee: string;
  availability?: {
    startHour: number;
    endHour: number;
  };
  onAvailabilityChange: (availability: { startHour: number; endHour: number }) => void;
  refetchAvailabilities: () => void;
}

export const DayAvailabilityForm = ({
  day,
  dayIndex,
  selectedOrganismee,
  availability,
  onAvailabilityChange,
  refetchAvailabilities
}: DayAvailabilityFormProps) => {
  const { isSubmitting, handleSave } = useAvailability({
    dayIndex,
    selectedOrganismee,
    refetchAvailabilities
  });

  const handleHourChange = (
    type: "startHour" | "endHour",
    hour: number
  ) => {
    if (!availability) {
      onAvailabilityChange({
        startHour: type === "startHour" ? hour : 0,
        endHour: type === "endHour" ? hour : 0
      });
      return;
    }

    onAvailabilityChange({
      ...availability,
      [type]: hour,
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-medium text-lg">{day}</h3>
      
      <TimeRangeSelector
        startHour={availability?.startHour}
        endHour={availability?.endHour}
        onStartHourChange={(hour) => handleHourChange("startHour", hour)}
        onEndHourChange={(hour) => handleHourChange("endHour", hour)}
      />

      <Button
        onClick={() => availability && handleSave(availability)}
        disabled={
          !selectedOrganismee ||
          !availability?.startHour ||
          !availability?.endHour ||
          isSubmitting
        }
        className="w-full md:w-auto"
      >
        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </div>
  );
};