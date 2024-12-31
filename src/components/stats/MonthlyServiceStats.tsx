import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

type MonthlyServiceStatsProps = {
  appointmentsByMonthAndService: any[];
  uniqueServices: string[];
  COLORS: string[];
};

export const MonthlyServiceStats = ({
  appointmentsByMonthAndService,
  uniqueServices,
  COLORS,
}: MonthlyServiceStatsProps) => {
  return (
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
  );
};