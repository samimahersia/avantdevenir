import { format } from "date-fns";
import { fr } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export const generateDayPDF = (appointments: any[], selectedDate: Date) => {
  try {
    const doc = new jsPDF();
    
    // Filtrer les rendez-vous du jour
    const dayAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return format(appointmentDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
    });

    // Titre du jour
    doc.setFontSize(16);
    doc.text(format(selectedDate, "EEEE d MMMM yyyy", { locale: fr }), 14, 20);

    // Grouper par service
    const byService = dayAppointments.reduce((acc, appointment) => {
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

    doc.save(`rendez-vous-${format(selectedDate, "yyyy-MM-dd")}.pdf`);
    toast.success("Le PDF journalier a été généré avec succès");
  } catch (error) {
    console.error("Erreur lors de la génération du PDF journalier:", error);
    toast.error("Erreur lors de la génération du PDF journalier");
  }
};