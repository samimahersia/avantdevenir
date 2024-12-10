import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ServiceSelectorProps {
  selectedService?: string;
  onServiceSelect: (serviceId: string) => void;
  selectedConsulate?: string;
}

interface Service {
  id: string;
  name: string;
}

const ServiceSelector = ({ selectedService, onServiceSelect, selectedConsulate }: ServiceSelectorProps) => {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services", selectedConsulate],
    queryFn: async () => {
      if (!selectedConsulate) {
        return [];
      }

      console.log("Fetching services for consulate:", selectedConsulate);
      const { data, error } = await supabase
        .from("consulate_services")
        .select(`
          service_id,
          services:service_id (
            id,
            name
          )
        `)
        .eq("consulate_id", selectedConsulate);
      
      if (error) {
        console.error("Error fetching services:", error);
        throw error;
      }

      // Transform the data to get the services array
      const servicesData = data.map(item => item.services) as Service[];
      console.log("Services fetched:", servicesData);
      return servicesData;
    },
    enabled: !!selectedConsulate
  });

  return (
    <Select 
      value={selectedService} 
      onValueChange={onServiceSelect}
      disabled={!selectedConsulate}
    >
      <SelectTrigger className="bg-[#D3E4FD] border-[#D3E4FD] hover:bg-[#C3D4ED]">
        <SelectValue placeholder={
          !selectedConsulate 
            ? "Sélectionnez d'abord un consulat" 
            : "Sélectionnez un service"
        } />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <SelectItem value="loading" disabled>
            Chargement...
          </SelectItem>
        ) : services.length > 0 ? (
          services.map((service) => (
            <SelectItem key={service.id} value={service.id}>
              {service.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="no-data" disabled>
            {selectedConsulate 
              ? "Aucun service disponible pour ce consulat" 
              : "Sélectionnez d'abord un consulat"
            }
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default ServiceSelector;