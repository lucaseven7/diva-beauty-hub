
import { Appointment } from "@/types/appointment";
import { Client } from "@/types/client";
import { addDays, subDays, format } from "date-fns";

// Definizioni vuote per i dati
export const mockClients: Client[] = [];
export const mockAppointments: Appointment[] = [];

// Dati vuoti per le statistiche
export const mockMonthlyStats = {
  currentMonth: {
    revenue: 0,
    appointments: 0,
    newClients: 0,
    averageServicePrice: 0
  },
  previousMonth: {
    revenue: 0,
    appointments: 0,
    newClients: 0,
    averageServicePrice: 0
  },
  // Dati vuoti per i grafici
  revenueData: [
    { name: 'Gen', value: 0 },
    { name: 'Feb', value: 0 },
    { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 },
  ],
  servicesData: [
    { name: 'Manicure', value: 0 },
    { name: 'Pedicure', value: 0 },
    { name: 'Nail Art', value: 0 },
    { name: 'Ceretta', value: 0 },
    { name: 'Viso', value: 0 },
  ]
};
