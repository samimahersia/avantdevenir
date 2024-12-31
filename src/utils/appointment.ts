import { addDays, isBefore, isWeekend } from "date-fns";

export interface TimeSlot {
  hour: number;
  minute: number;
}

// Créneaux disponibles de 9h à 14h
export const TIME_SLOTS: TimeSlot[] = Array.from({ length: 21 }, (_, i) => ({
  hour: Math.floor(i / 4) + 9,
  minute: (i % 4) * 15
}));

export const disabledDays = {
  before: new Date(),
  daysOfWeek: [0, 1] // Dimanche et Lundi
};

export const getAppointmentDate = (date: Date, selectedTime: TimeSlot): Date => {
  // Créer une nouvelle date avec le fuseau horaire local
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
    appointmentDate,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  return appointmentDate;
};

export const isDateDisabled = (date: Date): boolean => {
  if (isWeekend(date)) return true;
  if (isBefore(date, new Date())) return true;
  return false;
};