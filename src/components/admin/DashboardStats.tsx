import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, BarChart3, Users, Building2 } from "lucide-react";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

interface StatCardProps {
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  title: string;
  value: number;
}

const StatCard = ({ icon: Icon, bgColor, iconColor, title, value }: StatCardProps) => {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${bgColor}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardStats = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (error) {
    console.error("Error loading dashboard stats:", error);
    return (
      <div className="text-red-500 p-4">
        Erreur lors du chargement des statistiques
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white animate-pulse">
            <CardContent className="p-6 h-24" />
          </Card>
        ))}
      </div>
    );
  }

  const { total, completed, upcoming, canceled } = stats || {
    total: 0,
    completed: 0,
    upcoming: 0,
    canceled: 0
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={CalendarIcon}
        bgColor="bg-blue-100"
        iconColor="text-blue-600"
        title="Total des Rendez-vous"
        value={total}
      />
      <StatCard
        icon={BarChart3}
        bgColor="bg-green-100"
        iconColor="text-green-600"
        title="Terminés aujourd'hui"
        value={completed}
      />
      <StatCard
        icon={Users}
        bgColor="bg-yellow-100"
        iconColor="text-yellow-600"
        title="À venir aujourd'hui"
        value={upcoming}
      />
      <StatCard
        icon={Building2}
        bgColor="bg-red-100"
        iconColor="text-red-600"
        title="Annulés aujourd'hui"
        value={canceled}
      />
    </div>
  );
};

export default DashboardStats;