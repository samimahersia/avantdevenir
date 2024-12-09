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
  [consulateName: string]: {
    date: string;
    dayOfWeek: string;
    hour: string;
  }[];
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
        .order("date", { ascending: true });
      
      if (error) throw error;
      return data as Appointment[];
    }
  });

  // Grouper les rendez-vous par organisme et jour
  const groupedAppointments = appointments.reduce((acc: GroupedAppointments, appointment) => {
    const consulateName = appointment.consulates?.name || "Sans organisme";
    const date = new Date(appointment.date);
    const dayOfWeek = format(date, "EEEE", { locale: fr });
    const hour = format(date, "HH'H'mm", { locale: fr });

    if (!acc[consulateName]) {
      acc[consulateName] = [];
    }

    // Vérifier si nous avons déjà un créneau pour ce jour
    const existingDay = acc[consulateName].find(a => 
      format(new Date(a.date), "EEEE", { locale: fr }) === dayOfWeek
    );

    if (!existingDay) {
      acc[consulateName].push({
        date: appointment.date,
        dayOfWeek,
        hour
      });
    }

    return acc;
  }, {});

  // Couleurs pastel pour les différents organismes
  const gradients = [
    "from-[#E5DEFF] to-[#D3E4FD]",
    "from-[#FDE1D3] to-[#FFE8E8]",
    "from-[#F2FCE2] to-[#E8F5E9]",
    "from-[#FEF7CD] to-[#FFF3C4]",
    "from-[#FFDEE2] to-[#FFE8E8]"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Horaires par organisme</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedAppointments).map(([consulateName, slots], index) => (
            <div key={consulateName} className="space-y-2">
              <h3 className="font-medium text-gray-600">{consulateName}</h3>
              <div className="space-y-2">
                {slots.map((slot, slotIndex) => (
                  <div
                    key={slotIndex}
                    className={`p-4 rounded-lg bg-gradient-to-r ${gradients[index % gradients.length]}`}
                  >
                    <p className="font-medium capitalize">
                      {slot.dayOfWeek} de {slot.hour}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(groupedAppointments).length === 0 && (
            <p className="text-gray-600 text-sm">Aucun créneau cette semaine</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAppointments;