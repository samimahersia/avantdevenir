import { addHours, setHours, setMinutes, startOfToday } from "date-fns";

export interface TimeSlot {
  hour: number;
  minute: number;
}

// Generate time slots from 9h to 14h with 15min intervals
export const generateTimeSlots = () => {
  const slots: TimeSlot[] = [];
  for (let hour = 9; hour < 14; hour++) {
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

export const disabledDays = {
  before: startOfToday(),
};