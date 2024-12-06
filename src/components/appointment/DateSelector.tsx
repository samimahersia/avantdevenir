import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { fr } from "date-fns/locale";
import { disabledDays } from "@/utils/appointment";

interface DateSelectorProps {
  date?: Date;
  setDate: (date?: Date) => void;
}

const DateSelector = ({ date, setDate }: DateSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Date du rendez-vous *</Label>
      <Card>
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={disabledDays}
            className="mx-auto"
            locale={fr}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DateSelector;