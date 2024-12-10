import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { generateDayPDF } from "./pdf-generators/DayPdfGenerator";
import { generateWeekPDF } from "./pdf-generators/WeekPdfGenerator";
import { generateMonthPDF } from "./pdf-generators/MonthPdfGenerator";
import { generateYearPDF } from "./pdf-generators/YearPdfGenerator";

interface ExportButtonsProps {
  appointments: any[];
  selectedDate: Date;
}

const ExportButtons = ({ appointments, selectedDate }: ExportButtonsProps) => {
  return (
    <div className="mt-4 px-2 flex gap-2">
      <Button 
        onClick={() => generateDayPDF(appointments, selectedDate)}
        className="p-2 hover:bg-accent"
        variant="ghost"
        size="icon"
        title="Exporter les rendez-vous du jour en PDF"
      >
        <FileDown className="h-5 w-5 text-red-800" />
      </Button>
      <Button 
        onClick={() => generateMonthPDF(appointments, selectedDate)}
        className="p-2 hover:bg-accent"
        variant="ghost"
        size="icon"
        title="Exporter les rendez-vous du mois en PDF"
      >
        <FileDown className="h-5 w-5 text-blue-800" />
      </Button>
      <Button 
        onClick={() => generateWeekPDF(appointments, selectedDate)}
        className="p-2 hover:bg-accent"
        variant="ghost"
        size="icon"
        title="Exporter les rendez-vous de la semaine en PDF"
      >
        <FileDown className="h-5 w-5 text-green-800" />
      </Button>
      <Button 
        onClick={() => generateYearPDF(appointments, selectedDate)}
        className="p-2 hover:bg-accent"
        variant="ghost"
        size="icon"
        title="Exporter les rendez-vous de l'année en PDF"
      >
        <FileDown className="h-5 w-5 text-gray-900" />
      </Button>
    </div>
  );
};

export default ExportButtons;