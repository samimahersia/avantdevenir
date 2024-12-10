import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OrganismeeSelectorProps {
  value?: string | string[];
  onValueChange: (value: string | string[]) => void;
  multiple?: boolean;
}

export const OrganismeeSelector = ({ value, onValueChange, multiple }: OrganismeeSelectorProps) => {
  const { data: organismes = [], isLoading, error } = useQuery({
    queryKey: ["organismes"],
    queryFn: async () => {
      console.log("Fetching organismes...");
      const { data, error } = await supabase
        .from("consulates")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Error fetching organismes:", error);
        toast.error("Erreur lors du chargement des organismes");
        throw error;
      }
      
      console.log("Organismes fetched:", data);
      return data || [];
    }
  });

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        Une erreur est survenue lors du chargement des organismes
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
        ) : organismes.length > 0 ? (
          organismes.map((organisme) => (
            <SelectItem key={organisme.id} value={organisme.id}>
              {organisme.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="no-data" disabled>
            Aucun organisme disponible
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};