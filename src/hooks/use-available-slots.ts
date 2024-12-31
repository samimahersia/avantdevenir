import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TimeSlot } from "@/utils/appointment";

export const useAvailableSlots = (
  selectedDate?: Date,
  consulateId?: string,
  serviceId?: string,
  timeSlots: TimeSlot[] = []
) => {
  // Vérifier si c'est un jour férié
  const { data: holiday, isLoading: isCheckingHoliday } = useQuery({
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
      
      const jsDay = selectedDate.getDay();
      const dayOfWeek = jsDay === 0 ? 7 : jsDay;
      
      console.log("Checking availability for:", {
        date: selectedDate,
        consulateId,
        serviceId,
        jsDay,
        convertedDayOfWeek: dayOfWeek
      });

      const { data: recurringAvailabilities, error: recurringError } = await supabase
        .from("recurring_availabilities")
        .select("*")
        .eq("consulate_id", consulateId)
        .eq("day_of_week", dayOfWeek);

      console.log("Recurring availabilities found:", recurringAvailabilities);

      if (recurringError) {
        console.error("Error fetching recurring availabilities:", recurringError);
        return [];
      }

      const results = await Promise.all(
        timeSlots.map(async (slot) => {
          const slotDate = new Date(selectedDate);
          slotDate.setHours(slot.hour, slot.minute, 0, 0);

          const { data: isAvailable } = await supabase.rpc(
            'check_appointment_availability',
            {
              p_appointment_date: slotDate.toISOString(),
              p_service_id: serviceId,
              p_consulate_id: consulateId
            }
          );

          console.log("Slot availability check:", {
            slot: `${slot.hour}:${slot.minute}`,
            date: slotDate.toISOString(),
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
    isLoading: isLoading || isCheckingHoliday,
    holiday
  };
};