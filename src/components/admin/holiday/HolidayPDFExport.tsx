import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  generateDailyPDF, 
  generateWeeklyPDF, 
  generateQuarterlyPDF, 
  generateSemiAnnualPDF 
} from "./pdf-generators/PDFGenerators";

export const HolidayPDFExport = () => {
  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments-export"],
    queryFn: async () => {
      console.log("Fetching appointments for PDF export...");
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          profiles (first_name, last_name),
          consulates (name),
          services (name)
        `)
        .order("date", { ascending: true });
      
      if (error) {
        console.error("Error fetching appointments:", error);
        throw error;
      }
      
      console.log("Appointments fetched:", data);
      return data || [];
    }
  });

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => generateDailyPDF(appointments)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-accent"
        >
          <FileDown className="h-4 w-4 text-red-800" />
          <span>PDF Journalier</span>
        </Button>
        <Button
          onClick={() => generateWeeklyPDF(appointments)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-accent"
        >
          <FileDown className="h-4 w-4 text-blue-800" />
          <span>PDF Hebdomadaire</span>
        </Button>
        <Button
          onClick={() => generateQuarterlyPDF(appointments)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-accent"
        >
          <FileDown className="h-4 w-4 text-green-800" />
          <span>PDF Trimestriel</span>
        </Button>
        <Button
          onClick={() => generateSemiAnnualPDF(appointments)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-accent cursor-pointer"
        >
          <FileDown className="h-4 w-4 text-purple-800" />
          <span>PDF Semestriel</span>
        </Button>
      </div>
    </div>
  );
};

export default HolidayPDFExport;