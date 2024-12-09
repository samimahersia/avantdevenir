import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfWeek, endOfWeek } from "date-fns";

interface RecurringAvailability {
  day_of_week: number;
  start_hour: number;
  end_hour: number;
  consulates: {
    name: string;
  };
}

const RecentAppointments = () => {
  const { data: availabilities = [] } = useQuery({
    queryKey: ["recurring-availabilities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recurring_availabilities")
        .select(`
          day_of_week,
          start_hour,
          end_hour,
          consulates (
            name
          )
        `)
        .order("day_of_week", { ascending: true });
      
      if (error) throw error;
      return data as RecurringAvailability[];
    }
  });

  // Grouper les disponibilités par organisme
  const groupedAvailabilities = availabilities.reduce((acc: { [key: string]: RecurringAvailability[] }, availability) => {
    const consulateName = availability.consulates?.name || "Sans organisme";
    if (!acc[consulateName]) {
      acc[consulateName] = [];
    }
    acc[consulateName].push(availability);
    return acc;
  }, {});

  // Fonction pour convertir le numéro du jour en nom en français
  const getDayName = (dayNumber: number) => {
    const date = new Date(2024, 0, dayNumber + 1); // Le 1er janvier 2024 était un lundi
    return format(date, "EEEE", { locale: fr });
  };

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
          {Object.entries(groupedAvailabilities).map(([consulateName, availabilities], index) => (
            <div key={consulateName} className="space-y-2">
              <h3 className="font-medium text-gray-600">{consulateName}</h3>
              <div className="space-y-2">
                {availabilities.map((availability, slotIndex) => (
                  <div
                    key={slotIndex}
                    className={`p-4 rounded-lg bg-gradient-to-r ${gradients[index % gradients.length]}`}
                  >
                    <p className="font-medium capitalize">
                      {getDayName(availability.day_of_week)} de {availability.start_hour.toString().padStart(2, '0')}H00 à {availability.end_hour.toString().padStart(2, '0')}H00
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(groupedAvailabilities).length === 0 && (
            <p className="text-gray-600 text-sm">Aucun horaire configuré</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAppointments;