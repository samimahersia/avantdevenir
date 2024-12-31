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
    queryKey: ["holiday-check", selectedDate, consulateId],
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
        return null;
      }

      console.log("Holiday check result:", data);
      return data;
    },
    enabled: !!selectedDate && !!consulateId
  });

  const { data: availableSlots = [], isLoading } = useQuery({
    queryKey: ["available-slots", selectedDate, consulateId, serviceId],
    queryFn: async () => {
      if (!selectedDate || !consulateId || !serviceId || holiday) return [];

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

          const { data: isAvailable } = await supabase.rpc(
            'check_appointment_availability',
            {
              p_appointment_date: appointmentDate.toISOString(),
              p_service_id: serviceId,
              p_consulate_id: consulateId
            }
          );

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
    enabled: !!selectedDate && !!consulateId && !!serviceId && !holiday
  });

  return {
    availableSlots,
    isLoading,
    holiday
  };
};