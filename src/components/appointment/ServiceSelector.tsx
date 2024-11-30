import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ServiceSelectorProps {
  selectedService?: string;
  onServiceSelect: (serviceId: string) => void;
}

const ServiceSelector = ({ selectedService, onServiceSelect }: ServiceSelectorProps) => {
  const { data: services = [], isError, error, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .order("name");
      
        if (error) {
          console.error("Error fetching services:", error);
          toast.error("Erreur lors du chargement des services");
          throw error;
        }

        return data || [];
      } catch (err) {
        console.error("Service fetch error:", err);
        toast.error("Erreur lors du chargement des services");
        throw err;
      }
    },
    retry: 1
  });

  if (isError) {
    console.error("Query error:", error);
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Erreur de chargement des services" />
        </SelectTrigger>
      </Select>
    );
  }

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Chargement des services..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={selectedService} onValueChange={onServiceSelect}>
      <SelectTrigger className="bg-[#D3E4FD] border-[#D3E4FD] hover:bg-[#C3D4ED]">
        <SelectValue placeholder="Sélectionnez un service" />
      </SelectTrigger>
      <SelectContent>
        {services.map((service) => (
          <SelectItem key={service.id} value={service.id}>
            {service.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ServiceSelector;