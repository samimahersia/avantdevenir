import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfWeek, endOfWeek } from "date-fns";
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

const COLORS = ["#10B981", "#F59E0B", "#EF4444"];
const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

const AppointmentStats = () => {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });

  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .gte("date", startDate.toISOString())
        .lte("date", endDate.toISOString());
      
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

  // Prepare data for appointments by day
  const appointmentsByDay = DAYS.map(day => ({
    name: day,
    appointments: appointments.filter(apt => 
      format(new Date(apt.date), "EEEE", { locale: fr }) === day
    ).length
  }));

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
        {/* Appointments by Day */}
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous par jour</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentsByDay}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#6366F1" />
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