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
  console.log("DashboardContent rendering with:", {
    userType,
    selectedConsulate,
    selectedService
  });

  if (userType === "client") {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="flex flex-col gap-3 max-w-2xl mx-auto mt-3 px-2">
          <div className="w-full">
            <ConsulateSelector 
              value={selectedConsulate} 
              onValueChange={(value) => {
                console.log("Consulate selected:", value);
                if (value) {
                  setSelectedConsulate(value);
                  setSelectedService(undefined);
                }
              }}
            />
          </div>
          {selectedConsulate && (
            <div className="w-full animate-in fade-in slide-in-from-top-4 duration-500">
              <ServiceSelector
                selectedService={selectedService}
                onServiceSelect={(value) => {
                  console.log("Service selected:", value);
                  if (value) {
                    setSelectedService(value);
                  }
                }}
                selectedConsulate={selectedConsulate}
              />
            </div>
          )}
        </div>
        <div className="mt-4">
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
      <div className="flex justify-center px-2">
        <AdminDashboard 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    );
  }

  return null;
};