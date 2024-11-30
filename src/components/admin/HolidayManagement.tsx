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

const HolidayManagement = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      </CardContent>
    </Card>
  );
};

export default HolidayManagement;