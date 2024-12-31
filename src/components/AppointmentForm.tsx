import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format, addHours } from "date-fns";
import { fr } from "date-fns/locale";
import { isBefore } from "date-fns";
import TimeSlotSelector from "./appointment/TimeSlotSelector";
import { TIME_SLOTS, getAppointmentDate, TimeSlot } from "@/utils/appointment";
import AppointmentFormFields from "./appointment/AppointmentFormFields";
import DateSelector from "./appointment/DateSelector";

interface AppointmentFormProps {
  onSuccess?: () => void;
  selectedConsulate?: string;
  selectedService?: string;
}

const AppointmentForm = ({ onSuccess, selectedConsulate, selectedService }: AppointmentFormProps) => {
  const [date, setDate] = useState<Date>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTime, setSelectedTime] = useState<TimeSlot>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !selectedTime || !title.trim() || !selectedService || !selectedConsulate) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    const appointmentDate = getAppointmentDate(date, selectedTime);
    
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

      // Vérification de la disponibilité
      const { data: availabilityCheck, error: availabilityError } = await supabase
        .rpc('check_appointment_availability', {
          p_appointment_date: appointmentDate.toISOString(),
          p_service_id: selectedService,
          p_consulate_id: selectedConsulate
        });

      if (availabilityError) {
        toast.error("Erreur lors de la vérification de disponibilité");
        console.error("Availability check error:", availabilityError);
        return;
      }

      if (!availabilityCheck) {
        toast.error("Ce créneau n'est pas disponible. Veuillez choisir un autre horaire.");
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        toast.error("Erreur d'authentification");
        console.error("Auth error:", userError);
        return;
      }

      // Création du rendez-vous
      const { error: appointmentError } = await supabase
        .from("appointments")
        .insert({
          title,
          description,
          date: appointmentDate.toISOString(),
          client_id: userData.user.id,
          consulate_id: selectedConsulate,
          service_id: selectedService,
          status: 'en_attente'
        });

      if (appointmentError) {
        toast.error("Une erreur est survenue lors de la création du rendez-vous");
        console.error("Appointment creation error:", appointmentError);
        return;
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AppointmentFormFields
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
      />

      <DateSelector date={date} setDate={setDate} />

      <TimeSlotSelector
        selectedTime={selectedTime}
        onTimeSelect={setSelectedTime}
        timeSlots={TIME_SLOTS}
        selectedDate={date}
        consulateId={selectedConsulate}
        serviceId={selectedService}
      />

      <Button 
        type="submit" 
        disabled={!date || !selectedTime || !title.trim() || !selectedService || !selectedConsulate || isSubmitting}
        className="w-full sm:w-auto"
        size="lg"
      >
        {isSubmitting ? "En cours..." : "Demander un rendez-vous"}
      </Button>
    </form>
  );
};

export default AppointmentForm;
