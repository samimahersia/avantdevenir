import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfWeek, endOfWeek } from "date-fns";

interface Appointment {
  date: string;
  title: string;
  consulates: {
    name: string;
  };
}

interface GroupedAppointments {
  [consulateName: string]: Appointment[];
}

const RecentAppointments = () => {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });

  const { data: appointments = [] } = useQuery({
    queryKey: ["recent-appointments-by-consulate"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          date,
          title,
          consulates (
            name
          )
        `)
        .gte("date", startDate.toISOString())
        .lte("date", endDate.toISOString())
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data as Appointment[];
    }
  });

  // Grouper les rendez-vous par organisme
  const groupedAppointments = appointments.reduce((acc: GroupedAppointments, appointment) => {
    const consulateName = appointment.consulates?.name || "Sans organisme";
    if (!acc[consulateName]) {
      acc[consulateName] = [];
    }
    acc[consulateName].push(appointment);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Créneaux de la semaine</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedAppointments).map(([consulateName, consulateAppointments]) => (
            <div key={consulateName} className="space-y-2">
              <h3 className="font-medium text-sm text-gray-600">{consulateName}</h3>
              <div className="space-y-2">
                {consulateAppointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-md bg-[#E5DEFF] bg-opacity-50"
                  >
                    <p className="font-medium">
                      {format(new Date(appointment.date), "EEEE d MMMM à HH:mm", { locale: fr })}
                    </p>
                    <p className="text-sm text-gray-600">{appointment.title}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(groupedAppointments).length === 0 && (
            <p className="text-gray-600 text-sm">Aucun rendez-vous cette semaine</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAppointments;