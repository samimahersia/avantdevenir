import { addHours, setHours, setMinutes, startOfToday } from "date-fns";

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
  return setMinutes(setHours(date, selectedTime.hour), selectedTime.minute);
};

// Disable Mondays (1), Sundays (0) and Saturdays (6)
export const disabledDays = {
  before: startOfToday(),
  daysOfWeek: [0, 1, 6], // 0 is Sunday, 1 is Monday, 6 is Saturday
};