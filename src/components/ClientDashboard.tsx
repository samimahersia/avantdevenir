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
    <div className="space-y-8">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Nouveau Rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base">Titre du rendez-vous</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entrez le titre du rendez-vous"
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base">Date du rendez-vous</Label>
              <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="mx-auto"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={!date || !title}
              className="w-full sm:w-auto"
              size="lg"
            >
              Demander un rendez-vous
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Mes Rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-2 mb-4 sm:mb-0">
                  <h3 className="text-lg font-medium">{appointment.title}</h3>
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