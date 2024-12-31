import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import DashboardHeader from "./admin/DashboardHeader";
import DashboardStats from "./admin/DashboardStats";
import DashboardTabs from "./admin/DashboardTabs";

interface AdminDashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const AdminDashboard = ({ activeTab = "appointments", onTabChange }: AdminDashboardProps) => {
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    const handleTabSwitch = (event: CustomEvent) => {
      if (onTabChange) {
        onTabChange(event.detail.tab);
        if (event.detail.availability) {
          setSelectedAvailability(event.detail.availability);
        }
      }
    };

    window.addEventListener('switchTab', handleTabSwitch as EventListener);
    return () => {
      window.removeEventListener('switchTab', handleTabSwitch as EventListener);
    };
  }, [onTabChange]);

  useEffect(() => {
    if (location.state?.activeTab && onTabChange) {
      onTabChange(location.state.activeTab);
      if (location.state.availabilityToEdit) {
        setSelectedAvailability(location.state.availabilityToEdit);
      }
    }
  }, [location.state, onTabChange]);

  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  // Requête pour obtenir les statistiques des rendez-vous
  const { data: stats } = useQuery({
    queryKey: ["appointment-stats"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: totalAppointments } = await supabase
        .from("appointments")
        .select("count")
        .single();

      const { data: completedToday } = await supabase
        .from("appointments")
        .select("count")
        .eq("status", "termine")
        .gte("date", today.toISOString())
        .single();

      const { data: upcomingToday } = await supabase
        .from("appointments")
        .select("count")
        .eq("status", "confirme")
        .gte("date", today.toISOString())
        .lte("date", new Date(today.setHours(23, 59, 59, 999)).toISOString())
        .single();

      const { data: canceledToday } = await supabase
        .from("appointments")
        .select("count")
        .eq("status", "annule")
        .gte("date", today.toISOString())
        .single();

      return {
        total: totalAppointments?.count || 0,
        completed: completedToday?.count || 0,
        upcoming: upcomingToday?.count || 0,
        canceled: canceledToday?.count || 0
      };
    }
  });

  return (
    <div className="space-y-6 p-4 md:p-6">
      <DashboardHeader planType="free" />
      <DashboardStats stats={stats || { total: 0, completed: 0, upcoming: 0, canceled: 0 }} />
      <DashboardTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        isMobile={isMobile}
        selectedAvailability={selectedAvailability}
      />
    </div>
  );
};

export default AdminDashboard;