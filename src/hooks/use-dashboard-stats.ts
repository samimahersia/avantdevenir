import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  total: number;
  completed: number;
  upcoming: number;
  canceled: number;
}

const fetchStats = async (): Promise<DashboardStats> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  console.log("Fetching stats for date range:", {
    start: today.toISOString(),
    end: endOfDay.toISOString()
  });

  // Total appointments
  const { count: total, error: totalError } = await supabase
    .from("appointments")
    .select("*", { count: 'exact', head: true });

  if (totalError) {
    console.error("Error fetching total appointments:", totalError);
    throw totalError;
  }

  // Completed today
  const { count: completed, error: completedError } = await supabase
    .from("appointments")
    .select("*", { count: 'exact', head: true })
    .eq("status", "terminé")
    .gte("date", today.toISOString())
    .lte("date", endOfDay.toISOString());

  if (completedError) {
    console.error("Error fetching completed appointments:", completedError);
    throw completedError;
  }

  // Upcoming today
  const { count: upcoming, error: upcomingError } = await supabase
    .from("appointments")
    .select("*", { count: 'exact', head: true })
    .eq("status", "confirme")
    .gte("date", today.toISOString())
    .lte("date", endOfDay.toISOString());

  if (upcomingError) {
    console.error("Error fetching upcoming appointments:", upcomingError);
    throw upcomingError;
  }

  // Canceled today
  const { count: canceled, error: canceledError } = await supabase
    .from("appointments")
    .select("*", { count: 'exact', head: true })
    .eq("status", "annule")
    .gte("date", today.toISOString())
    .lte("date", endOfDay.toISOString());

  if (canceledError) {
    console.error("Error fetching canceled appointments:", canceledError);
    throw canceledError;
  }

  return {
    total: total || 0,
    completed: completed || 0,
    upcoming: upcoming || 0,
    canceled: canceled || 0
  };
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchStats,
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });
};