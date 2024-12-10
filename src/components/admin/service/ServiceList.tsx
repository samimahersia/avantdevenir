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

// Predefined color combinations for services
const serviceColors = [
  { bg: "#E5DEFF", text: "#6E59A5", hover: "#D6BCFA" }, // Purple
  { bg: "#D3E4FD", text: "#3B82F6", hover: "#93C5FD" }, // Blue
  { bg: "#FDE1D3", text: "#F97316", hover: "#FDBA74" }, // Orange
  { bg: "#F2FCE2", text: "#65A30D", hover: "#BBF7D0" }, // Green
  { bg: "#FFDEE2", text: "#E11D48", hover: "#FDA4AF" }, // Red
  { bg: "#FEF7CD", text: "#CA8A04", hover: "#FDE68A" }, // Yellow
];

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

      return data.reduce((acc, item) => {
        if (!acc[item.service_id]) {
          acc[item.service_id] = [];
        }
        acc[item.service_id].push(item.consulates.name);
        return acc;
      }, {});
    }
  });

  // Function to get color based on service index
  const getServiceColor = (index: number) => {
    return serviceColors[index % serviceColors.length];
  };

  return (
    <div className="space-y-4">
      {services.map((service, index) => {
        const colors = getServiceColor(index);
        return (
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
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                      }}
                      className={`hover:bg-[${colors.hover}]`}
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
        );
      })}
    </div>
  );
};

export default ServiceList;