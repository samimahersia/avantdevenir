import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardHeader from "./admin/DashboardHeader";
import DashboardStats from "./admin/DashboardStats";
import DashboardTabs from "./admin/DashboardTabs";
import { TabChangeHandler } from "./admin/TabChangeHandler";

interface AdminDashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const AdminDashboard = ({ activeTab = "appointments", onTabChange }: AdminDashboardProps) => {
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const isMobile = useIsMobile();

  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {onTabChange && (
        <TabChangeHandler
          onTabChange={onTabChange}
          setSelectedAvailability={setSelectedAvailability}
        />
      )}
      <DashboardHeader planType="free" />
      <DashboardStats />
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