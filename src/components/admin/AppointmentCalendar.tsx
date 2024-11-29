import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

const AppointmentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: appointments = [] } = useQuery({
    queryKey: ["admin-appointments", format(selectedDate, "yyyy-MM")],
    queryFn: async () => {
      const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from("appointments")
        .select("*, profiles(first_name, last_name)")
        .gte("date", startOfMonth.toISOString())
        .lte("date", endOfMonth.toISOString())
        .order("date", { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const selectedDayAppointments = appointments.filter(
    (appointment) => format(new Date(appointment.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendrier</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Rendez-vous du {format(selectedDate, "d MMMM yyyy", { locale: fr })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedDayAppointments.length === 0 ? (
              <p className="text-muted-foreground">Aucun rendez-vous ce jour</p>
            ) : (
              selectedDayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 border rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{appointment.title}</h3>
                    <Badge
                      variant={
                        appointment.status === "approuve"
                          ? "success"
                          : appointment.status === "refuse"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {appointment.status === "approuve"
                        ? "Approuvé"
                        : appointment.status === "refuse"
                        ? "Refusé"
                        : "En attente"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(appointment.date), "HH'h'mm", { locale: fr })} - {appointment.profiles?.first_name} {appointment.profiles?.last_name}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentCalendar;