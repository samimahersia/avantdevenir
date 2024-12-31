import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["appointment-stats"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      const { data: totalAppointments } = await supabase
        .from("appointments")
        .select("count")
        .single();

      const { data: completedToday, error: completedError } = await supabase
        .from("appointments")
        .select("count")
        .eq("status", "terminé")
        .gte("date", today.toISOString())
        .lte("date", endOfDay.toISOString())
        .single();

      if (completedError) {
        console.error('Error fetching completed appointments:', completedError);
      }

      const { data: upcomingToday } = await supabase
        .from("appointments")
        .select("count")
        .eq("status", "confirme")
        .gte("date", today.toISOString())
        .lte("date", endOfDay.toISOString())
        .single();

      const { data: canceledToday } = await supabase
        .from("appointments")
        .select("count")
        .eq("status", "annule")
        .gte("date", today.toISOString())
        .lte("date", endOfDay.toISOString())
        .single();

      return {
        total: totalAppointments?.count || 0,
        completed: completedToday?.count || 0,
        upcoming: upcomingToday?.count || 0,
        canceled: canceledToday?.count || 0
      };
    }
  });
};