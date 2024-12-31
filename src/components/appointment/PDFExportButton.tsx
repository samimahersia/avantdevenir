import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PDFExportButtonProps {
  appointments: any[];
}

const PDFExportButton = ({ appointments }: PDFExportButtonProps) => {
  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text("Mes Rendez-vous", 14, 20);
      
      const tableData = appointments.map(appointment => [
        format(new Date(appointment.date), "dd/MM/yyyy HH'h'mm", { locale: fr }),
        appointment.title,
        appointment.services?.name || "",
        appointment.status === "approuve" ? "Approuvé" :
        appointment.status === "refuse" ? "Refusé" : "En attente"
      ]);

      autoTable(doc, {
        head: [["Date", "Titre", "Service", "Statut"]],
        body: tableData,
        startY: 30,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save("mes-rendez-vous.pdf");
      toast.success("PDF généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={generatePDF}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Télécharger PDF</span>
    </Button>
  );
};

export default PDFExportButton;