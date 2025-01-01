import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TimeSlot } from "@/utils/appointment";

export const useAvailableSlots = (
  selectedDate?: Date,
  consulateId?: string,
  serviceId?: string,
  timeSlots: TimeSlot[] = []
) => {
  const { data: holiday } = useQuery({
    queryKey: ["holiday-check", selectedDate?.toISOString().split('T')[0], consulateId],
    queryFn: async () => {
      if (!selectedDate || !consulateId) return null;

      const formattedDate = selectedDate.toISOString().split('T')[0];
      console.log("Checking holiday for date:", formattedDate);

      const { data, error } = await supabase
        .from("consulate_holidays")
        .select("*")
        .eq("consulate_id", consulateId)
        .eq("date", formattedDate)
        .maybeSingle();

      if (error) {
        console.error("Error checking holiday:", error);
        throw error;
      }

      console.log("Holiday check result:", data);
      return data;
    },
    enabled: !!selectedDate && !!consulateId
  });

  const { data: availableSlots = [], isLoading, error } = useQuery({
    queryKey: ["available-slots", selectedDate?.toISOString(), consulateId, serviceId],
    queryFn: async () => {
      if (!selectedDate || !consulateId || !serviceId) return [];

      console.log("Fetching availabilities for consulate:", consulateId);
      
      const results = await Promise.all(
        timeSlots.map(async (slot) => {
          const appointmentDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            slot.hour,
            slot.minute
          );

          const { data: isAvailable, error } = await supabase.rpc(
            'check_appointment_availability',
            {
              p_appointment_date: appointmentDate.toISOString(),
              p_service_id: serviceId,
              p_consulate_id: consulateId
            }
          );

          if (error) {
            console.error("Error checking availability:", error);
            throw error;
          }

          console.log("Slot availability check:", {
            slot: `${slot.hour}:${slot.minute}`,
            date: appointmentDate.toISOString(),
            isAvailable
          });

          return {
            ...slot,
            isAvailable
          };
        })
      );

      return results.filter(slot => slot.isAvailable);
    },
    enabled: !!selectedDate && !!consulateId && !!serviceId && !holiday,
    retry: 1
  });

  return {
    availableSlots,
    isLoading,
    holiday,
    error
  };
};