import { ConsulateSelector } from "./ConsulateSelector";
import ServiceSelector from "./appointment/ServiceSelector";
import ClientDashboard from "./ClientDashboard";
import AdminDashboard from "./AdminDashboard";

interface DashboardContentProps {
  userType: "client" | "admin";
  userRole: string | null;
  selectedConsulate?: string;
  setSelectedConsulate: (value: string) => void;
  selectedService?: string;
  setSelectedService: (value: string) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const DashboardContent = ({
  userType,
  userRole,
  selectedConsulate,
  setSelectedConsulate,
  selectedService,
  setSelectedService,
  activeTab,
  setActiveTab
}: DashboardContentProps) => {
  if (userType === "client") {
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-2xl mx-auto mt-6">
          <div className="w-full sm:w-1/2">
            <ConsulateSelector 
              value={selectedConsulate} 
              onValueChange={setSelectedConsulate}
            />
          </div>
          <div className="w-full sm:w-1/2">
            <ServiceSelector
              selectedService={selectedService}
              onServiceSelect={setSelectedService}
            />
          </div>
        </div>
        <div className="mt-6">
          <ClientDashboard 
            selectedConsulate={selectedConsulate} 
            selectedService={selectedService}
          />
        </div>
      </div>
    );
  }

  if (userRole === "admin") {
    return (
      <div className="flex justify-center">
        <AdminDashboard 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    );
  }

  return null;
};