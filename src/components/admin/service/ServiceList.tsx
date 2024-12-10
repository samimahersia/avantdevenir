import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface ServiceListProps {
  services: any[];
  onEdit: (service: any) => void;
  onDelete: (id: string) => void;
}

const ServiceList = ({ services, onEdit, onDelete }: ServiceListProps) => {
  const { data: serviceConsulates = {} } = useQuery({
    queryKey: ["service-consulates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consulate_services")
        .select(`
          service_id,
          consulates (
            id,
            name
          )
        `);
      
      if (error) throw error;

      // Transform data into a map of service_id -> consulate names
      return data.reduce((acc, item) => {
        if (!acc[item.service_id]) {
          acc[item.service_id] = [];
        }
        acc[item.service_id].push(item.consulates.name);
        return acc;
      }, {});
    }
  });

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <div
          key={service.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="space-y-1">
            <h3 className="font-medium">{service.name}</h3>
            {service.description && (
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Durée: {service.duration} minutes, Max concurrent: {service.max_concurrent}
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Consulats liés:</span>
              {serviceConsulates[service.id]?.length > 0 ? (
                serviceConsulates[service.id].map((consulateName: string) => (
                  <Badge 
                    key={consulateName}
                    variant="secondary" 
                    className="bg-[#E5DEFF] text-[#6E59A5] hover:bg-[#D6BCFA]"
                  >
                    {consulateName}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">Aucun</span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(service)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="text-red-500"
              onClick={() => onDelete(service.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceList;