import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ConsulateSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
}

export const ConsulateSelector = ({ value, onValueChange }: ConsulateSelectorProps) => {
  const { data: consulates = [], isLoading, error } = useQuery({
    queryKey: ["consulates"],
    queryFn: async () => {
      console.log("Fetching consulates...");
      const { data, error } = await supabase
        .from("consulates")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Error fetching consulates:", error);
        toast.error("Erreur lors du chargement des consulats");
        throw error;
      }
      
      console.log("Consulates fetched:", data);
      return data || [];
    }
  });

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        Une erreur est survenue lors du chargement des consulats
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="bg-[#D3E4FD] border-[#D3E4FD] hover:bg-[#C3D4ED]">
        <SelectValue placeholder="Sélectionnez un organisme" />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <SelectItem value="loading" disabled>
            Chargement...
          </SelectItem>
        ) : consulates.length > 0 ? (
          consulates.map((consulate) => (
            <SelectItem key={consulate.id} value={consulate.id}>
              {consulate.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="no-data" disabled>
            Aucun consulat disponible
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};