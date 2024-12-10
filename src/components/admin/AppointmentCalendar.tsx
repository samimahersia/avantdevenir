import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

const AppointmentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: appointments = [] } = useQuery({
    queryKey: ["admin-appointments", format(selectedDate, "yyyy-MM")],
    queryFn: async () => {
      const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from("appointments")
        .select("*, profiles(first_name, last_name), services(name)")
        .gte("date", startOfMonth.toISOString())
        .lte("date", endOfMonth.toISOString())
        .order("date", { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const selectedDayAppointments = appointments.filter(
    (appointment) => format(new Date(appointment.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  );

  const generatePDF = () => {
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
          // Titre du service
          doc.setFontSize(14);
          doc.text(serviceName, 14, yOffset);
          yOffset += 10;

          // Tableau des rendez-vous
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
      toast.success("Le PDF a été généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Calendrier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border w-full max-w-[300px]"
              locale={fr}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </div>
          <div className="mt-4">
            <Button 
              onClick={generatePDF}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
              variant="outline"
            >
              <FileDown className="mr-2 h-4 w-4" />
              Exporter les rendez-vous en PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            Rendez-vous du {format(selectedDate, "d MMMM yyyy", { locale: fr })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedDayAppointments.length === 0 ? (
              <p className="text-muted-foreground">Aucun rendez-vous ce jour</p>
            ) : (
              selectedDayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 border rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{appointment.title}</h3>
                    <Badge
                      variant={
                        appointment.status === "approuve"
                          ? "success"
                          : appointment.status === "refuse"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {appointment.status === "approuve"
                        ? "Approuvé"
                        : appointment.status === "refuse"
                        ? "Refusé"
                        : "En attente"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(appointment.date), "HH'h'mm", { locale: fr })} - {appointment.profiles?.first_name} {appointment.profiles?.last_name}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentCalendar;