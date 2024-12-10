import { format, startOfYear, endOfYear } from "date-fns";
import { fr } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export const generateYearPDF = (appointments: any[], selectedDate: Date) => {
  try {
    const doc = new jsPDF();
    const yearStart = startOfYear(selectedDate);
    const yearEnd = endOfYear(selectedDate);
    
    // Filtrer les rendez-vous de l'année
    const yearAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= yearStart && appointmentDate <= yearEnd;
    });

    // Grouper les rendez-vous par mois
    const groupedAppointments = yearAppointments.reduce((acc, appointment) => {
      const month = format(new Date(appointment.date), "yyyy-MM");
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(appointment);
      return acc;
    }, {});

    // Pour chaque mois, trier par service et heure
    Object.entries(groupedAppointments).forEach(([month, monthAppointments], index) => {
      if (index > 0) {
        doc.addPage();
      }

      // Titre du mois
      doc.setFontSize(16);
      doc.text(format(new Date(month), "MMMM yyyy", { locale: fr }), 14, 20);

      // Grouper par service
      const byService = (monthAppointments as any[]).reduce((acc, appointment) => {
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
            format(new Date(appointment.date), "dd/MM/yyyy HH'h'mm", { locale: fr }),
            appointment.title,
            `${appointment.profiles?.first_name || ''} ${appointment.profiles?.last_name || ''}`,
            appointment.status === "approuve" ? "Approuvé" :
            appointment.status === "refuse" ? "Refusé" : "En attente"
          ]);

        autoTable(doc, {
          startY: yOffset,
          head: [["Date", "Titre", "Client", "Statut"]],
          body: tableData,
          margin: { left: 14 },
          styles: { fontSize: 10 },
          headStyles: { fillColor: [41, 128, 185] },
        });

        yOffset = (doc as any).lastAutoTable.finalY + 20;
      });
    });

    doc.save(`rendez-vous-${format(yearStart, "yyyy")}.pdf`);
    toast.success("Le PDF annuel a été généré avec succès");
  } catch (error) {
    console.error("Erreur lors de la génération du PDF annuel:", error);
    toast.error("Erreur lors de la génération du PDF annuel");
  }
};
