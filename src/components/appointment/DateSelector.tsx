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
  selectedConsulate?: string;
}

const DateSelector = ({ date, setDate, selectedConsulate }: DateSelectorProps) => {
  const { data: holidays = [], isLoading } = useQuery({
    queryKey: ["holidays", selectedConsulate],
    queryFn: async () => {
      if (!selectedConsulate) return [];
      
      console.log("Fetching holidays for consulate:", selectedConsulate);
      const { data, error } = await supabase
        .from("consulate_holidays")
        .select("date")
        .eq("consulate_id", selectedConsulate);
      
      if (error) {
        console.error("Error fetching holidays:", error);
        throw error;
      }
      
      const holidayDates = data.map(holiday => new Date(holiday.date));
      console.log("Fetched holidays:", holidayDates);
      return holidayDates;
    },
    enabled: !!selectedConsulate
  });

  const modifiers = {
    holiday: holidays
  };

  const modifiersClassNames = {
    holiday: "text-red-500 font-bold bg-red-50"
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setDate(undefined);
      return;
    }

    // Check if the selected date is a holiday
    const isHoliday = holidays.some(holiday => 
      holiday.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]
    );

    if (!isHoliday) {
      console.log("Selected date:", selectedDate);
      setDate(selectedDate);
    } else {
      console.log("Selected date is a holiday:", selectedDate);
    }
  };

  // Create the disabled dates configuration
  const disabledConfig: Matcher[] = [
    { before: disabledDays.before },
    { dayOfWeek: disabledDays.daysOfWeek }
  ];

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Date du rendez-vous * (Mardi à Samedi)</Label>
        <Card>
          <CardContent className="p-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Date du rendez-vous * (Mardi à Samedi)</Label>
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