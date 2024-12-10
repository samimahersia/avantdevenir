import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OrganismeeSelectorProps {
  value?: string | string[];
  onValueChange: (value: string | string[]) => void;
  multiple?: boolean;
}

export const OrganismeeSelector = ({ value, onValueChange, multiple = false }: OrganismeeSelectorProps) => {
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

  // Ensure we have a valid string value for the Select component
  const selectValue = multiple 
    ? (Array.isArray(value) ? value[0] : undefined)
    : (typeof value === 'string' ? value : undefined);

  const handleValueChange = (newValue: string) => {
    if (multiple) {
      // For multiple selection, maintain array of values
      const currentValues = Array.isArray(value) ? value : [];
      const updatedValues = currentValues.includes(newValue)
        ? currentValues.filter(v => v !== newValue)
        : [...currentValues, newValue];
      onValueChange(updatedValues);
    } else {
      // For single selection, just pass the value
      onValueChange(newValue);
    }
  };

  return (
    <Select 
      value={selectValue} 
      onValueChange={handleValueChange}
    >
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
            <SelectItem 
              key={organisme.id} 
              value={organisme.id}
            >
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