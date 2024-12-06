import { addHours, setHours, setMinutes, startOfToday } from "date-fns";

export interface TimeSlot {
  hour: number;
  minute: number;
}

// Generate time slots from 8h to 16h with 15min intervals
export const generateTimeSlots = () => {
  const slots: TimeSlot[] = [];
  for (let hour = 8; hour < 16; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      slots.push({ hour, minute });
    }
  }
  return slots;
};

export const TIME_SLOTS = generateTimeSlots();

export const getAppointmentDate = (date: Date, selectedTime: TimeSlot) => {
  return setMinutes(setHours(date, selectedTime.hour), selectedTime.minute);
};

// Disable Sundays (0) and Saturdays (6)
export const disabledDays = {
  before: startOfToday(),
  daysOfWeek: [0, 6], // 0 is Sunday, 6 is Saturday
};