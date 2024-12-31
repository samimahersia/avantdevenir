import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { fr } from "date-fns/locale";
import { disabledDays } from "@/utils/appointment";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Matcher } from "react-day-picker";

interface DateSelectorProps {
  date?: Date;
  setDate: (date?: Date) => void;
}

const DateSelector = ({ date, setDate }: DateSelectorProps) => {
  const { data: holidays = [] } = useQuery({
    queryKey: ["holidays"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consulate_holidays")
        .select("date");
      
      if (error) throw error;
      return data.map(holiday => new Date(holiday.date));
    }
  });

  const modifiers = {
    holiday: holidays
  };

  const modifiersClassNames = {
    holiday: "text-red-500 font-bold bg-red-50 cursor-not-allowed"
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && !holidays.some(holiday => 
      holiday.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]
    )) {
      setDate(selectedDate);
    }
  };

  // Create the disabled dates configuration
  const disabledConfig: Matcher[] = [
    { before: disabledDays.before },
    { dayOfWeek: disabledDays.daysOfWeek }
  ];

  return (
    <div className="space-y-2">
      <Label>Date du rendez-vous *</Label>
      <Card>
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            disabled={[...disabledConfig, ...holidays]}
            className="mx-auto"
            locale={fr}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DateSelector;