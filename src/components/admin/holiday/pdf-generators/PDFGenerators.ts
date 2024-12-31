import { format, startOfQuarter, endOfQuarter, startOfWeek, endOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export const generateDailyPDF = (appointments: any[]) => {
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

export const generateWeeklyPDF = (appointments: any[]) => {
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

export const generateQuarterlyPDF = (appointments: any[]) => {
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

export const generateSemiAnnualPDF = (appointments: any[]) => {
  try {
    const doc = new jsPDF();
    const today = new Date();
    const isFirstHalf = today.getMonth() < 6;
    const halfYearStart = new Date(today.getFullYear(), isFirstHalf ? 0 : 6, 1);
    const halfYearEnd = new Date(today.getFullYear(), isFirstHalf ? 5 : 11, 31, 23, 59, 59);
    
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

    const filename = `rendez-vous-${isFirstHalf ? 'S1' : 'S2'}-${today.getFullYear()}.pdf`;
    doc.save(filename);
    toast.success("PDF semestriel généré avec succès");
  } catch (error) {
    console.error("Erreur lors de la génération du PDF semestriel:", error);
    toast.error("Erreur lors de la génération du PDF");
  }
};