import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

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
        {/* Appointments by Month and Service */}
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous par mois et service</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentsByMonthAndService}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {uniqueServices.map((service, index) => (
                  <Bar 
                    key={service} 
                    dataKey={service}
                    stackId="a"
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution des statuts</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Popular Time Slots */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Créneaux horaires populaires</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSlotData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Nombre de rendez-vous"
                  stroke="#6366F1" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentStats;