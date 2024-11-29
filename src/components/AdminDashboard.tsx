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
        return <Badge variant="secondary">En attente</Badge>;
      case "approuve":
        return <Badge variant="success">Approuvé</Badge>;
      case "refuse":
        return <Badge variant="destructive">Refusé</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <h3 className="font-medium">{appointment.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Client: {appointment.clientName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date: {appointment.date.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(appointment.status)}
                  {appointment.status === "en_attente" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleStatusChange(appointment.id, "approuve")}
                      >
                        <Check className="w-4 h-4" />
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleStatusChange(appointment.id, "refuse")}
                      >
                        <X className="w-4 h-4" />
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