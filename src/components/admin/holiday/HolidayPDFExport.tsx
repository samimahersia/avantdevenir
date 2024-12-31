import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

const HolidayPDFExport = () => {
  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments-export"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          profiles(first_name, last_name),
          services(name),
          consulates(name)
        `)
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const generateDailyPDF = () => {
    try {
      const doc = new jsPDF();
      const today = new Date();
      
      const todayAppointments = appointments.filter(apt => 
        format(new Date(apt.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
      );

      doc.setFontSize(16);
      doc.text(`Rendez-vous du ${format(today, 'dd MMMM yyyy', { locale: fr })}`, 14, 20);

      const tableData = todayAppointments.map(apt => [
        format(new Date(apt.date), 'HH:mm', { locale: fr }),
        apt.services?.name || '',
        `${apt.profiles?.first_name || ''} ${apt.profiles?.last_name || ''}`,
        apt.consulates?.name || '',
        apt.status === 'approuve' ? 'Approuvé' :
        apt.status === 'refuse' ? 'Refusé' : 'En attente'
      ]);

      autoTable(doc, {
        head: [['Heure', 'Service', 'Client', 'Consulat', 'Statut']],
        body: tableData,
        startY: 30,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save(`rendez-vous-${format(today, 'yyyy-MM-dd')}.pdf`);
      toast.success("PDF journalier généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF journalier:", error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  const generateWeeklyPDF = () => {
    try {
      const doc = new jsPDF();
      const today = new Date();
      const weekStart = startOfWeek(today, { locale: fr });
      const weekEnd = endOfWeek(today, { locale: fr });
      
      const weekAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= weekStart && aptDate <= weekEnd;
      });

      doc.setFontSize(16);
      doc.text(`Rendez-vous de la semaine du ${format(weekStart, 'dd MMMM', { locale: fr })} au ${format(weekEnd, 'dd MMMM yyyy', { locale: fr })}`, 14, 20);

      const tableData = weekAppointments.map(apt => [
        format(new Date(apt.date), 'dd/MM/yyyy HH:mm', { locale: fr }),
        apt.services?.name || '',
        `${apt.profiles?.first_name || ''} ${apt.profiles?.last_name || ''}`,
        apt.consulates?.name || '',
        apt.status === 'approuve' ? 'Approuvé' :
        apt.status === 'refuse' ? 'Refusé' : 'En attente'
      ]);

      autoTable(doc, {
        head: [['Date et heure', 'Service', 'Client', 'Consulat', 'Statut']],
        body: tableData,
        startY: 30,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save(`rendez-vous-semaine-${format(weekStart, 'yyyy-MM-dd')}.pdf`);
      toast.success("PDF hebdomadaire généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF hebdomadaire:", error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  const generateQuarterlyPDF = () => {
    try {
      const doc = new jsPDF();
      const today = new Date();
      const quarterStart = startOfQuarter(today);
      const quarterEnd = endOfQuarter(today);
      
      const quarterAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= quarterStart && aptDate <= quarterEnd;
      });

      doc.setFontSize(16);
      doc.text(`Rendez-vous du trimestre (${format(quarterStart, 'dd/MM/yyyy', { locale: fr })} - ${format(quarterEnd, 'dd/MM/yyyy', { locale: fr })})`, 14, 20);

      const tableData = quarterAppointments.map(apt => [
        format(new Date(apt.date), 'dd/MM/yyyy HH:mm', { locale: fr }),
        apt.services?.name || '',
        `${apt.profiles?.first_name || ''} ${apt.profiles?.last_name || ''}`,
        apt.consulates?.name || '',
        apt.status === 'approuve' ? 'Approuvé' :
        apt.status === 'refuse' ? 'Refusé' : 'En attente'
      ]);

      autoTable(doc, {
        head: [['Date et heure', 'Service', 'Client', 'Consulat', 'Statut']],
        body: tableData,
        startY: 30,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save(`rendez-vous-trimestre-${format(quarterStart, 'yyyy-[Q]Q', { locale: fr })}.pdf`);
      toast.success("PDF trimestriel généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF trimestriel:", error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  const generateSemiAnnualPDF = () => {
    try {
      const doc = new jsPDF();
      const today = new Date();
      const isFirstHalf = today.getMonth() < 6;
      const halfYearStart = new Date(today.getFullYear(), isFirstHalf ? 0 : 6, 1);
      const halfYearEnd = new Date(today.getFullYear(), isFirstHalf ? 5 : 11, 31);
      
      const halfYearAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= halfYearStart && aptDate <= halfYearEnd;
      });

      doc.setFontSize(16);
      doc.text(`Rendez-vous du ${isFirstHalf ? 'premier' : 'second'} semestre ${today.getFullYear()}`, 14, 20);

      const tableData = halfYearAppointments.map(apt => [
        format(new Date(apt.date), 'dd/MM/yyyy HH:mm', { locale: fr }),
        apt.services?.name || '',
        `${apt.profiles?.first_name || ''} ${apt.profiles?.last_name || ''}`,
        apt.consulates?.name || '',
        apt.status === 'approuve' ? 'Approuvé' :
        apt.status === 'refuse' ? 'Refusé' : 'En attente'
      ]);

      autoTable(doc, {
        head: [['Date et heure', 'Service', 'Client', 'Consulat', 'Statut']],
        body: tableData,
        startY: 30,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save(`rendez-vous-semestre-${format(halfYearStart, 'yyyy-[S]S', { locale: fr })}.pdf`);
      toast.success("PDF semestriel généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF semestriel:", error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <Button
        onClick={generateDailyPDF}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <FileDown className="h-4 w-4 text-red-800" />
        <span>PDF Journalier</span>
      </Button>
      <Button
        onClick={generateWeeklyPDF}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <FileDown className="h-4 w-4 text-blue-800" />
        <span>PDF Hebdomadaire</span>
      </Button>
      <Button
        onClick={generateQuarterlyPDF}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <FileDown className="h-4 w-4 text-green-800" />
        <span>PDF Trimestriel</span>
      </Button>
      <Button
        onClick={generateSemiAnnualPDF}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <FileDown className="h-4 w-4 text-purple-800" />
        <span>PDF Semestriel</span>
      </Button>
    </div>
  );
};

export default HolidayPDFExport;