import { startOfToday } from "date-fns";

export interface TimeSlot {
  hour: number;
  minute: number;
}

// Generate time slots from 9h to 14h with 15min intervals
export const generateTimeSlots = () => {
  const slots: TimeSlot[] = [];
  for (let hour = 9; hour <= 14; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      // Ne pas inclure 14:15, 14:30, 14:45
      if (hour === 14 && minute > 0) continue;
      slots.push({ hour, minute });
    }
  }
  return slots;
};

export const TIME_SLOTS = generateTimeSlots();

export const getAppointmentDate = (date: Date, selectedTime: TimeSlot) => {
  // Créer une nouvelle date en préservant le fuseau horaire local
  const appointmentDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    selectedTime.hour,
    selectedTime.minute
  );
  
  console.log("Generated appointment date:", {
    originalDate: date,
    selectedTime,
    appointmentDate: appointmentDate.toISOString(),
    localTime: appointmentDate.toLocaleTimeString(),
    hour: appointmentDate.getHours(),
    localHour: appointmentDate.getHours(),
    utcHour: appointmentDate.getUTCHours(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  
  return appointmentDate;
};

// Disable Sundays (0) and Mondays (1)
export const disabledDays = {
  before: startOfToday(),
  daysOfWeek: [0, 1], // 0 is Sunday, 1 is Monday
};