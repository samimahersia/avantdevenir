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
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Generate time slots from 9h to 14h with 15min intervals
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 14; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      slots.push({ hour, minute });
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

interface AppointmentFormProps {
  onSuccess?: () => void;
  selectedConsulate?: string;
}

const AppointmentForm = ({ onSuccess, selectedConsulate }: AppointmentFormProps) => {
  const [date, setDate] = useState<Date>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTime, setSelectedTime] = useState<{ hour: number; minute: number }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !selectedTime || !title.trim()) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    const appointmentDate = setMinutes(setHours(date, selectedTime.hour), selectedTime.minute);
    
    if (isBefore(appointmentDate, new Date())) {
      toast.error("La date sélectionnée est déjà passée");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        toast.error("Veuillez vous connecter pour prendre un rendez-vous");
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        toast.error("Erreur d'authentification");
        console.error("Auth error:", userError);
        return;
      }

      const { data: appointment, error: appointmentError } = await supabase
        .from("appointments")
        .insert({
          title,
          description,
          date: appointmentDate.toISOString(),
          client_id: userData.user.id,
          consulate_id: selectedConsulate,
        })
        .select()
        .single();

      if (appointmentError) {
        if (appointmentError.message.includes("Ce créneau n'est pas disponible")) {
          toast.error("Ce créneau n'est pas disponible. Veuillez choisir un autre horaire.");
        } else {
          console.error("Appointment error:", appointmentError);
          toast.error("Une erreur est survenue lors de la création du rendez-vous");
        }
        return;
      }

      // Send notification
      const { error: notificationError } = await supabase.functions.invoke("send-notification", {
        body: {
          userId: userData.user.id,
          type: "appointment_created",
          title: "Nouveau rendez-vous créé",
          content: `Votre demande de rendez-vous pour le ${format(appointmentDate, "d MMMM yyyy 'à' HH:mm", { locale: fr })} a été enregistrée. Vous recevrez une notification lors de sa validation.`,
          metadata: {
            appointmentId: appointment.id,
          },
        },
      });

      if (notificationError) {
        console.error("Notification error:", notificationError);
      }

      toast.success("Rendez-vous demandé avec succès");
      setTitle("");
      setDescription("");
      setDate(undefined);
      setSelectedTime(undefined);
      onSuccess?.();

    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Une erreur inattendue s'est produite");
    } finally {
      setIsSubmitting(false);
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
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {TIME_SLOTS.map((slot) => (
            <Button
              key={`${slot.hour}-${slot.minute}`}
              type="button"
              variant={selectedTime?.hour === slot.hour && selectedTime?.minute === slot.minute ? "default" : "outline"}
              onClick={() => setSelectedTime(slot)}
              className="w-full"
            >
              {slot.hour}:{slot.minute.toString().padStart(2, '0')}
            </Button>
          ))}
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={!date || !selectedTime || !title.trim() || isSubmitting}
        className="w-full sm:w-auto"
        size="lg"
      >
        {isSubmitting ? "En cours..." : "Demander un rendez-vous"}
      </Button>
    </form>
  );
};

export default AppointmentForm;