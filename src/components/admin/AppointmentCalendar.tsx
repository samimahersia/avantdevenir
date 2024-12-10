import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import ExportButtons from "./calendar/ExportButtons";
import AppointmentList from "./calendar/AppointmentList";

const AppointmentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: appointments = [] } = useQuery({
    queryKey: ["admin-appointments", format(selectedDate, "yyyy-MM")],
    queryFn: async () => {
      const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from("appointments")
        .select("*, profiles(first_name, last_name), services(name)")
        .gte("date", startOfMonth.toISOString())
        .lte("date", endOfMonth.toISOString())
        .order("date", { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Calendrier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border w-full max-w-[300px]"
              locale={fr}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </div>
          <ExportButtons appointments={appointments} selectedDate={selectedDate} />
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            Rendez-vous du {format(selectedDate, "d MMMM yyyy", { locale: fr })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentList appointments={appointments} selectedDate={selectedDate} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentCalendar;