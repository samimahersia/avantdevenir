import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([
    { id: 1, title: "Premier rendez-vous", date: new Date(2024, 3, 15), status: "en_attente", clientName: "Jean Dupont" },
    { id: 2, title: "Deuxième rendez-vous", date: new Date(2024, 3, 20), status: "approuve", clientName: "Marie Martin" },
    { id: 3, title: "Consultation initiale", date: new Date(2024, 3, 25), status: "en_attente", clientName: "Pierre Durant" }
  ]);

  const handleStatusChange = (appointmentId: number, newStatus: string) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === appointmentId 
        ? { ...appointment, status: newStatus }
        : appointment
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_attente":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">En attente</Badge>;
      case "approuve":
        return <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Approuvé</Badge>;
      case "refuse":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Refusé</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Gestion des Rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-6 border rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-2 mb-4 md:mb-0">
                  <h3 className="text-lg font-medium">{appointment.title}</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="font-medium">Client:</span> {appointment.clientName}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="font-medium">Date:</span> {appointment.date.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {getStatusBadge(appointment.status)}
                  {appointment.status === "en_attente" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                        onClick={() => handleStatusChange(appointment.id, "approuve")}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleStatusChange(appointment.id, "refuse")}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Refuser
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;