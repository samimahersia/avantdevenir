import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";

const HolidayManagement = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch holidays
  const { data: holidays = [] } = useQuery({
    queryKey: ["holidays"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consulate_holidays")
        .select("*")
        .order("date", { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch recent appointments
  const { data: recentAppointments = [] } = useQuery({
    queryKey: ["recent-appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("date, title")
        .order("date", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      toast.error("Veuillez sélectionner une date");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("consulate_holidays")
        .insert({
          date: format(selectedDate, "yyyy-MM-dd"),
          description: description.trim() || null
        });

      if (error) throw error;

      toast.success("Jour férié ajouté avec succès");
      setSelectedDate(undefined);
      setDescription("");
    } catch (error) {
      console.error("Error adding holiday:", error);
      toast.error("Erreur lors de l'ajout du jour férié");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des jours fériés</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={handleAddHoliday} className="space-y-4">
            <div className="space-y-2">
              <Label>Date du jour férié</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={fr}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Jour de l'an"
              />
            </div>

            <Button type="submit" disabled={!selectedDate || isSubmitting}>
              {isSubmitting ? "En cours..." : "Ajouter le jour férié"}
            </Button>
          </form>

          <div className="space-y-6">
            <Card className="bg-[#E8F5E9]">
              <CardHeader>
                <CardTitle className="text-lg">Jours fériés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {holidays.map((holiday) => (
                    <div
                      key={holiday.id}
                      className="p-2 bg-white/50 rounded-md"
                    >
                      <p className="font-medium">
                        {format(new Date(holiday.date), "dd MMMM yyyy", { locale: fr })}
                      </p>
                      {holiday.description && (
                        <p className="text-sm text-gray-600">{holiday.description}</p>
                      )}
                    </div>
                  ))}
                  {holidays.length === 0 && (
                    <p className="text-gray-600 text-sm">Aucun jour férié enregistré</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Derniers créneaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentAppointments.map((appointment, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-50 rounded-md"
                    >
                      <p className="font-medium">
                        {format(new Date(appointment.date), "dd MMMM yyyy à HH:mm", { locale: fr })}
                      </p>
                      <p className="text-sm text-gray-600">{appointment.title}</p>
                    </div>
                  ))}
                  {recentAppointments.length === 0 && (
                    <p className="text-gray-600 text-sm">Aucun rendez-vous récent</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HolidayManagement;