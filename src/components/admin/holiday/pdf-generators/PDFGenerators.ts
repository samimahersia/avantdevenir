import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const formatAppointmentData = (appointment: any) => ({
  date: format(new Date(appointment.date), "dd/MM/yyyy HH:mm", { locale: fr }),
  client: `${appointment.profiles?.first_name || ''} ${appointment.profiles?.last_name || ''}`,
  service: appointment.services?.name || '',
  consulate: appointment.consulates?.name || '',
  status: appointment.status || ''
});

export const generateDailyPDF = (appointments: any[]) => {
  console.log("Generating daily PDF...");
  const doc = new jsPDF();
  const today = new Date();
  
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate.toDateString() === today.toDateString();
  });

  doc.text("Rendez-vous du jour", 14, 15);
  doc.text(format(today, "dd MMMM yyyy", { locale: fr }), 14, 25);

  const tableData = filteredAppointments.map(formatAppointmentData);

  (doc as any).autoTable({
    startY: 35,
    head: [["Date", "Client", "Service", "Organisme", "Statut"]],
    body: tableData.map(row => [row.date, row.client, row.service, row.consulate, row.status])
  });

  doc.save(`rendez-vous-${format(today, "dd-MM-yyyy")}.pdf`);
};

export const generateWeeklyPDF = (appointments: any[]) => {
  console.log("Generating weekly PDF...");
  const doc = new jsPDF();
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
  });

  doc.text("Rendez-vous de la semaine", 14, 15);
  doc.text(
    `Du ${format(startOfWeek, "dd MMMM", { locale: fr })} au ${format(endOfWeek, "dd MMMM yyyy", { locale: fr })}`,
    14,
    25
  );

  const tableData = filteredAppointments.map(formatAppointmentData);

  (doc as any).autoTable({
    startY: 35,
    head: [["Date", "Client", "Service", "Organisme", "Statut"]],
    body: tableData.map(row => [row.date, row.client, row.service, row.consulate, row.status])
  });

  doc.save(`rendez-vous-semaine-${format(today, "dd-MM-yyyy")}.pdf`);
};

export const generateQuarterlyPDF = (appointments: any[]) => {
  console.log("Generating quarterly PDF...");
  const doc = new jsPDF();
  const today = new Date();
  const startOfQuarter = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
  const endOfQuarter = new Date(startOfQuarter.getFullYear(), startOfQuarter.getMonth() + 3, 0);

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate >= startOfQuarter && appointmentDate <= endOfQuarter;
  });

  doc.text("Rendez-vous du trimestre", 14, 15);
  doc.text(
    `Du ${format(startOfQuarter, "dd MMMM", { locale: fr })} au ${format(endOfQuarter, "dd MMMM yyyy", { locale: fr })}`,
    14,
    25
  );

  const tableData = filteredAppointments.map(formatAppointmentData);

  (doc as any).autoTable({
    startY: 35,
    head: [["Date", "Client", "Service", "Organisme", "Statut"]],
    body: tableData.map(row => [row.date, row.client, row.service, row.consulate, row.status])
  });

  doc.save(`rendez-vous-trimestre-${format(today, "dd-MM-yyyy")}.pdf`);
};

export const generateSemiAnnualPDF = (appointments: any[]) => {
  console.log("Generating semi-annual PDF...");
  const doc = new jsPDF();
  const today = new Date();
  const startOfSemiAnnual = new Date(today.getFullYear(), Math.floor(today.getMonth() / 6) * 6, 1);
  const endOfSemiAnnual = new Date(startOfSemiAnnual.getFullYear(), startOfSemiAnnual.getMonth() + 6, 0);

  console.log("Date range:", {
    start: startOfSemiAnnual,
    end: endOfSemiAnnual
  });

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate >= startOfSemiAnnual && appointmentDate <= endOfSemiAnnual;
  });

  console.log("Filtered appointments:", filteredAppointments.length);

  doc.text("Rendez-vous du semestre", 14, 15);
  doc.text(
    `Du ${format(startOfSemiAnnual, "dd MMMM", { locale: fr })} au ${format(endOfSemiAnnual, "dd MMMM yyyy", { locale: fr })}`,
    14,
    25
  );

  const tableData = filteredAppointments.map(formatAppointmentData);

  (doc as any).autoTable({
    startY: 35,
    head: [["Date", "Client", "Service", "Organisme", "Statut"]],
    body: tableData.map(row => [row.date, row.client, row.service, row.consulate, row.status])
  });

  doc.save(`rendez-vous-semestre-${format(today, "dd-MM-yyyy")}.pdf`);
};