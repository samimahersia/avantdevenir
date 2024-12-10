import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { toast } from "sonner";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportButtonsProps {
  appointments: any[];
  selectedDate: Date;
}

const ExportButtons = ({ appointments, selectedDate }: ExportButtonsProps) => {
  const generateMonthPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Grouper les rendez-vous par jour
      const groupedAppointments = appointments.reduce((acc, appointment) => {
        const day = format(new Date(appointment.date), "yyyy-MM-dd");
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(appointment);
        return acc;
      }, {});

      // Pour chaque jour, trier par service et heure
      Object.entries(groupedAppointments).forEach(([day, dayAppointments], index) => {
        if (index > 0) {
          doc.addPage();
        }

        // Titre du jour
        doc.setFontSize(16);
        doc.text(format(new Date(day), "EEEE d MMMM yyyy", { locale: fr }), 14, 20);

        // Grouper par service
        const byService = (dayAppointments as any[]).reduce((acc, appointment) => {
          const serviceName = appointment.services?.name || "Sans service";
          if (!acc[serviceName]) {
            acc[serviceName] = [];
          }
          acc[serviceName].push(appointment);
          return acc;
        }, {});

        let yOffset = 30;
        
        Object.entries(byService).forEach(([serviceName, serviceAppointments]) => {
          doc.setFontSize(14);
          doc.text(serviceName, 14, yOffset);
          yOffset += 10;

          const tableData = (serviceAppointments as any[])
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map(appointment => [
              format(new Date(appointment.date), "HH'h'mm", { locale: fr }),
              appointment.title,
              `${appointment.profiles?.first_name || ''} ${appointment.profiles?.last_name || ''}`,
              appointment.status === "approuve" ? "Approuvé" :
              appointment.status === "refuse" ? "Refusé" : "En attente"
            ]);

          autoTable(doc, {
            startY: yOffset,
            head: [["Heure", "Titre", "Client", "Statut"]],
            body: tableData,
            margin: { left: 14 },
            styles: { fontSize: 10 },
            headStyles: { fillColor: [41, 128, 185] },
          });

          yOffset = (doc as any).lastAutoTable.finalY + 20;
        });
      });

      doc.save(`rendez-vous-${format(selectedDate, "yyyy-MM")}.pdf`);
      toast.success("Le PDF mensuel a été généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF mensuel:", error);
      toast.error("Erreur lors de la génération du PDF mensuel");
    }
  };

  const generateWeekPDF = () => {
    try {
      const doc = new jsPDF();
      const weekStart = startOfWeek(selectedDate, { locale: fr });
      const weekEnd = endOfWeek(selectedDate, { locale: fr });
      
      // Filtrer les rendez-vous de la semaine
      const weekAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= weekStart && appointmentDate <= weekEnd;
      });

      // Grouper les rendez-vous par jour
      const groupedAppointments = weekAppointments.reduce((acc, appointment) => {
        const day = format(new Date(appointment.date), "yyyy-MM-dd");
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(appointment);
        return acc;
      }, {});

      // Pour chaque jour, trier par service et heure
      Object.entries(groupedAppointments).forEach(([day, dayAppointments], index) => {
        if (index > 0) {
          doc.addPage();
        }

        // Titre du jour
        doc.setFontSize(16);
        doc.text(format(new Date(day), "EEEE d MMMM yyyy", { locale: fr }), 14, 20);

        // Grouper par service
        const byService = (dayAppointments as any[]).reduce((acc, appointment) => {
          const serviceName = appointment.services?.name || "Sans service";
          if (!acc[serviceName]) {
            acc[serviceName] = [];
          }
          acc[serviceName].push(appointment);
          return acc;
        }, {});

        let yOffset = 30;
        
        Object.entries(byService).forEach(([serviceName, serviceAppointments]) => {
          doc.setFontSize(14);
          doc.text(serviceName, 14, yOffset);
          yOffset += 10;

          const tableData = (serviceAppointments as any[])
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map(appointment => [
              format(new Date(appointment.date), "HH'h'mm", { locale: fr }),
              appointment.title,
              `${appointment.profiles?.first_name || ''} ${appointment.profiles?.last_name || ''}`,
              appointment.status === "approuve" ? "Approuvé" :
              appointment.status === "refuse" ? "Refusé" : "En attente"
            ]);

          autoTable(doc, {
            startY: yOffset,
            head: [["Heure", "Titre", "Client", "Statut"]],
            body: tableData,
            margin: { left: 14 },
            styles: { fontSize: 10 },
            headStyles: { fillColor: [41, 128, 185] },
          });

          yOffset = (doc as any).lastAutoTable.finalY + 20;
        });
      });

      doc.save(`rendez-vous-semaine-${format(weekStart, "yyyy-MM-dd")}.pdf`);
      toast.success("Le PDF hebdomadaire a été généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF hebdomadaire:", error);
      toast.error("Erreur lors de la génération du PDF hebdomadaire");
    }
  };

  return (
    <div className="mt-4 px-2 flex gap-2">
      <Button 
        onClick={generateMonthPDF}
        className="p-2 hover:bg-accent"
        variant="ghost"
        size="icon"
        title="Exporter les rendez-vous du mois en PDF"
      >
        <FileDown className="h-5 w-5 text-blue-800" />
      </Button>
      <Button 
        onClick={generateWeekPDF}
        className="p-2 hover:bg-accent"
        variant="ghost"
        size="icon"
        title="Exporter les rendez-vous de la semaine en PDF"
      >
        <FileDown className="h-5 w-5 text-green-800" />
      </Button>
    </div>
  );
};

export default ExportButtons;