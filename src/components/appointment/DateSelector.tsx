import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { fr } from "date-fns/locale";
import { disabledDays } from "@/utils/appointment";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const modifiersStyles = {
    holiday: {
      color: "#991B1B", // Rouge foncé (red-800)
      fontWeight: "bold"
    }
  };

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
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DateSelector;