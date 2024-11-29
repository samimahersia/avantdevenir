import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const ClientDashboard = () => {
  const [date, setDate] = useState<Date>();
  const [title, setTitle] = useState("");
  const [appointments, setAppointments] = useState([
    { id: 1, title: "Premier rendez-vous", date: new Date(2024, 3, 15), status: "en_attente" },
    { id: 2, title: "Deuxième rendez-vous", date: new Date(2024, 3, 20), status: "approuve" }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && title) {
      const newAppointment = {
        id: appointments.length + 1,
        title,
        date,
        status: "en_attente"
      };
      setAppointments([...appointments, newAppointment]);
      setTitle("");
      setDate(undefined);
    }
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
          <CardTitle>Nouveau Rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du rendez-vous</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entrez le titre du rendez-vous"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Date du rendez-vous</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                required
              />
            </div>
            <Button type="submit" disabled={!date || !title}>
              Demander un rendez-vous
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mes Rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{appointment.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {appointment.date.toLocaleDateString()}
                  </p>
                </div>
                {getStatusBadge(appointment.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;