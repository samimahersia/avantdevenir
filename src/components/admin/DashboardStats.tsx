import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, BarChart3, Users, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface StatCardProps {
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  title: string;
  queryKey: string;
  queryFn: () => Promise<number>;
}

const StatCard = ({ icon: Icon, bgColor, iconColor, title, queryKey, queryFn }: StatCardProps) => {
  const { data: count = 0 } = useQuery({
    queryKey: [queryKey],
    queryFn
  });

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${bgColor}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{count}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardStats = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const getTotalAppointments = async () => {
    const { count, error } = await supabase
      .from("appointments")
      .select("*", { count: 'exact', head: true });
    
    if (error) {
      console.error("Error fetching total appointments:", error);
      return 0;
    }
    
    return count || 0;
  };

  const getCompletedToday = async () => {
    const { count, error } = await supabase
      .from("appointments")
      .select("*", { count: 'exact', head: true })
      .eq("status", "terminé")
      .gte("date", today.toISOString())
      .lte("date", endOfDay.toISOString());
    
    if (error) {
      console.error("Error fetching completed appointments:", error);
      return 0;
    }

    console.log("Completed appointments query:", {
      startDate: today.toISOString(),
      endDate: endOfDay.toISOString(),
      count
    });
    
    return count || 0;
  };

  const getUpcomingToday = async () => {
    const { count, error } = await supabase
      .from("appointments")
      .select("*", { count: 'exact', head: true })
      .eq("status", "confirme")
      .gte("date", today.toISOString())
      .lte("date", endOfDay.toISOString());
    
    if (error) {
      console.error("Error fetching upcoming appointments:", error);
      return 0;
    }
    
    return count || 0;
  };

  const getCanceledToday = async () => {
    const { count, error } = await supabase
      .from("appointments")
      .select("*", { count: 'exact', head: true })
      .eq("status", "annule")
      .gte("date", today.toISOString())
      .lte("date", endOfDay.toISOString());
    
    if (error) {
      console.error("Error fetching canceled appointments:", error);
      return 0;
    }
    
    return count || 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={CalendarIcon}
        bgColor="bg-blue-100"
        iconColor="text-blue-600"
        title="Total des Rendez-vous"
        queryKey="total-appointments"
        queryFn={getTotalAppointments}
      />
      <StatCard
        icon={BarChart3}
        bgColor="bg-green-100"
        iconColor="text-green-600"
        title="Terminés aujourd'hui"
        queryKey="completed-today"
        queryFn={getCompletedToday}
      />
      <StatCard
        icon={Users}
        bgColor="bg-yellow-100"
        iconColor="text-yellow-600"
        title="À venir aujourd'hui"
        queryKey="upcoming-today"
        queryFn={getUpcomingToday}
      />
      <StatCard
        icon={Building2}
        bgColor="bg-red-100"
        iconColor="text-red-600"
        title="Annulés aujourd'hui"
        queryKey="canceled-today"
        queryFn={getCanceledToday}
      />
    </div>
  );
};

export default DashboardStats;