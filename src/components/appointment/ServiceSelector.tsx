import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ServiceSelectorProps {
  selectedService?: string;
  onServiceSelect: (serviceId: string) => void;
}

const ServiceSelector = ({ selectedService, onServiceSelect }: ServiceSelectorProps) => {
  const { data: services = [], isError } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name");
      
      if (error) {
        toast.error("Erreur lors du chargement des services");
        throw error;
      }
      return data || [];
    }
  });

  if (isError) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Erreur de chargement" />
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