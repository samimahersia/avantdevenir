import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ServiceSelectorProps {
  selectedService?: string;
  onServiceSelect: (serviceId: string) => void;
}

const ServiceSelector = ({ selectedService, onServiceSelect }: ServiceSelectorProps) => {
  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Select value={selectedService} onValueChange={onServiceSelect}>
      <SelectTrigger>
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