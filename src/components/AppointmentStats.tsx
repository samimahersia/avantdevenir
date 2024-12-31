import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { MonthlyServiceStats } from "./stats/MonthlyServiceStats";
import { StatusDistribution } from "./stats/StatusDistribution";
import { TimeSlotPopularity } from "./stats/TimeSlotPopularity";

const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#6366F1", "#EC4899", "#8B5CF6"];
const MONTHS = Array.from({ length: 12 }, (_, i) => format(new Date(2024, i, 1), "MMMM", { locale: fr }));

const AppointmentStats = () => {
  const startDate = startOfMonth(new Date());
  const endDate = endOfMonth(new Date());

  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*, services(name)")
        .gte("date", startOfMonth(new Date(new Date().getFullYear(), 0, 1)).toISOString())
        .lte("date", endOfMonth(new Date(new Date().getFullYear(), 11, 31)).toISOString());
      
      if (error) throw error;
      return data;
    }
  });

  // Prepare data for status distribution
  const statusData = appointments.reduce((acc: any[], appointment) => {
    const statusIndex = acc.findIndex(item => item.name === appointment.status);
    if (statusIndex === -1) {
      acc.push({ name: appointment.status, value: 1 });
    } else {
      acc[statusIndex].value += 1;
    }
    return acc;
  }, []);

  // Prepare data for appointments by month and service
  const appointmentsByMonthAndService = MONTHS.map(month => {
    const monthAppointments = appointments.filter(apt => 
      format(new Date(apt.date), "MMMM", { locale: fr }) === month
    );

    // Group appointments by service
    const serviceGroups = monthAppointments.reduce((acc: { [key: string]: number }, apt) => {
      const serviceName = apt.services?.name || "Sans service";
      acc[serviceName] = (acc[serviceName] || 0) + 1;
      return acc;
    }, {});

    return {
      name: month,
      ...serviceGroups
    };
  });

  // Get unique services for the legend
  const uniqueServices = Array.from(new Set(appointments.map(apt => apt.services?.name || "Sans service")));

  // Prepare data for popular time slots
  const timeSlotData = appointments.reduce((acc: any[], appointment) => {
    const hour = format(new Date(appointment.date), "HH:00");
    const slotIndex = acc.findIndex(item => item.hour === hour);
    if (slotIndex === -1) {
      acc.push({ hour, count: 1 });
    } else {
      acc[slotIndex].count += 1;
    }
    return acc.sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MonthlyServiceStats 
          appointmentsByMonthAndService={appointmentsByMonthAndService}
          uniqueServices={uniqueServices}
          COLORS={COLORS}
        />
        <StatusDistribution 
          statusData={statusData}
          COLORS={COLORS}
        />
        <TimeSlotPopularity 
          timeSlotData={timeSlotData}
        />
      </div>
    </div>
  );
};

export default AppointmentStats;