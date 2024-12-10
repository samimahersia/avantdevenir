import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { OrganismeeSelector } from "@/components/OrganismeeSelector";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ServiceFormProps {
  service?: any;
  onSubmit: (formData: any) => Promise<void>;
}

const ServiceForm = ({ service, onSubmit }: ServiceFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 15,
    max_concurrent: 3,
    consulateIds: [] as string[]
  });

  const { data: linkedConsulates = [] } = useQuery({
    queryKey: ["linked-consulates", service?.id],
    queryFn: async () => {
      if (!service?.id) return [];
      
      const { data, error } = await supabase
        .from("consulate_services")
        .select("consulate_id")
        .eq("service_id", service.id);
      
      if (error) throw error;
      return data.map(item => item.consulate_id);
    },
    enabled: !!service?.id
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description || "",
        duration: service.duration,
        max_concurrent: service.max_concurrent,
        consulateIds: linkedConsulates
      });
    }
  }, [service, linkedConsulates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Nom</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Durée (minutes)</label>
        <Input
          type="number"
          min="1"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Rendez-vous simultanés maximum</label>
        <Input
          type="number"
          min="1"
          value={formData.max_concurrent}
          onChange={(e) => setFormData({ ...formData, max_concurrent: parseInt(e.target.value) })}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Organismes liés</label>
        <OrganismeeSelector
          value={formData.consulateIds}
          onValueChange={(value) => {
            setFormData(prev => ({
              ...prev,
              consulateIds: Array.isArray(value) ? value : [value]
            }));
          }}
          multiple
        />
      </div>
      <DialogFooter>
        <Button type="submit">
          {service ? "Modifier" : "Ajouter"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ServiceForm;