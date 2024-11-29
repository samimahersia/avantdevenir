import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addHours, setHours, setMinutes, isBefore, startOfToday } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AVAILABLE_HOURS = Array.from({ length: 9 }, (_, i) => i + 9); // 9h à 17h

const AppointmentForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [date, setDate] = useState<Date>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedHour, setSelectedHour] = useState<number>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || selectedHour === undefined || !title.trim()) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    const appointmentDate = setMinutes(setHours(date, selectedHour), 0);
    
    if (isBefore(appointmentDate, new Date())) {
      toast.error("La date sélectionnée est déjà passée");
      return;
    }

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data: appointment, error } = await supabase
        .from("appointments")
        .insert({
          title,
          description,
          date: appointmentDate.toISOString(),
          client_id: userData.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Send email notification
      const { error: notificationError } = await supabase.functions.invoke("send-appointment-notification", {
        body: { appointmentId: appointment.id, type: "new" }
      });

      if (notificationError) {
        console.error("Failed to send notification:", notificationError);
        toast.success("Rendez-vous créé mais l'email n'a pas pu être envoyé");
      } else {
        toast.success("Rendez-vous demandé avec succès");
      }

      setTitle("");
      setDescription("");
      setDate(undefined);
      setSelectedHour(undefined);
      onSuccess?.();
    } catch (error) {
      toast.error("Erreur lors de la création du rendez-vous");
    }
  };

  const disabledDays = {
    before: startOfToday(),
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Titre du rendez-vous *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Consultation initiale"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description détaillée</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez l'objet de votre rendez-vous..."
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Date du rendez-vous *</Label>
        <Card>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={disabledDays}
              className="mx-auto"
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <Label>Heure du rendez-vous *</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {AVAILABLE_HOURS.map((hour) => (
            <Button
              key={hour}
              type="button"
              variant={selectedHour === hour ? "default" : "outline"}
              onClick={() => setSelectedHour(hour)}
              className="w-full"
            >
              {hour}:00
            </Button>
          ))}
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={!date || selectedHour === undefined || !title.trim()}
        className="w-full sm:w-auto"
        size="lg"
      >
        Demander un rendez-vous
      </Button>
    </form>
  );
};

export default AppointmentForm;