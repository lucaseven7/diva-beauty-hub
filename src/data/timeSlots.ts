export const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30"
];

// Funzione per verificare la disponibilità di uno slot temporale
export const isTimeSlotAvailable = (date: string, time: string, appointments: any[]) => {
  return !appointments.some(
    (appt) => appt.date === date && appt.time === time && appt.status !== "cancelled"
  );
};

// Funzione per ottenere tutti gli slot disponibili per una data
export const getAvailableTimeSlots = (date: string, appointments: any[]) => {
  return timeSlots.filter((time) => isTimeSlotAvailable(date, time, appointments));
};