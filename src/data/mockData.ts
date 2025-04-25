
import { Appointment } from "@/types/appointment";
import { Client } from "@/types/client";
import { addDays, subDays, format } from "date-fns";

// Create mock clients
export const mockClients: Client[] = [
  {
    id: "client-1",
    name: "Sofia Rossi",
    phone: "333-123-4567",
    email: "sofia.rossi@example.com",
    totalVisits: 12,
    lastVisit: "21/04/2025",
    preferences: ["Smalto semipermanente", "Colori pastello"]
  },
  {
    id: "client-2",
    name: "Giulia Bianchi",
    phone: "333-765-4321",
    avatar: "/placeholder.svg",
    totalVisits: 8,
    lastVisit: "18/04/2025",
    preferences: ["Nail art", "Ricostruzione unghie"]
  },
  {
    id: "client-3",
    name: "Francesca Verdi",
    phone: "333-987-6543",
    totalVisits: 5,
    lastVisit: "15/04/2025",
    preferences: ["Manicure classica", "Tonalità rosse"]
  },
  {
    id: "client-4",
    name: "Maria Esposito",
    phone: "333-456-7890",
    totalVisits: 3,
    lastVisit: "10/04/2025",
    preferences: ["Pedicure", "Massaggio piedi"]
  },
  {
    id: "client-5",
    name: "Anna Romano",
    phone: "333-234-5678",
    avatar: "/placeholder.svg",
    totalVisits: 7,
    lastVisit: "05/04/2025",
    preferences: ["Ceretta", "Trattamento viso"]
  }
];

// Generate some appointments for the next few days
const today = new Date();

export const mockAppointments: Appointment[] = [
  {
    id: "appt-1",
    clientId: "client-1",
    clientName: "Sofia Rossi",
    clientPhone: "333-123-4567",
    service: "Smalto semipermanente",
    price: 35,
    date: format(today, "yyyy-MM-dd"),
    time: "10:00",
    notes: "Preferisce colori pastello",
    status: "scheduled"
  },
  {
    id: "appt-2",
    clientId: "client-2",
    clientName: "Giulia Bianchi",
    clientAvatar: "/placeholder.svg",
    clientPhone: "333-765-4321",
    service: "Ricostruzione unghie",
    price: 50,
    date: format(today, "yyyy-MM-dd"),
    time: "14:30",
    status: "scheduled"
  },
  {
    id: "appt-3",
    clientId: "client-3",
    clientName: "Francesca Verdi",
    clientPhone: "333-987-6543",
    service: "Manicure classica",
    price: 25,
    date: format(addDays(today, 1), "yyyy-MM-dd"),
    time: "11:00",
    notes: "Preferisce tonalità rosse",
    status: "scheduled"
  },
  {
    id: "appt-4",
    clientId: "client-4",
    clientName: "Maria Esposito",
    clientPhone: "333-456-7890",
    service: "Pedicure + Massaggio",
    price: 45,
    date: format(addDays(today, 2), "yyyy-MM-dd"),
    time: "16:00",
    status: "scheduled"
  },
  {
    id: "appt-5",
    clientId: "client-5",
    clientName: "Anna Romano",
    clientAvatar: "/placeholder.svg",
    clientPhone: "333-234-5678",
    service: "Ceretta + Trattamento viso",
    price: 60,
    date: format(addDays(today, 3), "yyyy-MM-dd"),
    time: "09:30",
    status: "scheduled"
  },
  {
    id: "appt-6",
    clientId: "client-1",
    clientName: "Sofia Rossi",
    clientPhone: "333-123-4567",
    service: "Ritocco smalto",
    price: 20,
    date: format(subDays(today, 7), "yyyy-MM-dd"),
    time: "15:00",
    imageUrl: "/placeholder.svg",
    status: "completed"
  },
  {
    id: "appt-7",
    clientId: "client-2",
    clientName: "Giulia Bianchi",
    clientAvatar: "/placeholder.svg",
    clientPhone: "333-765-4321",
    service: "Nail art",
    price: 40,
    date: format(subDays(today, 10), "yyyy-MM-dd"),
    time: "13:00",
    imageUrl: "/placeholder.svg",
    status: "completed"
  }
];

// Mock data for statistics
export const mockMonthlyStats = {
  currentMonth: {
    revenue: 850,
    appointments: 17,
    newClients: 3,
    averageServicePrice: 50
  },
  previousMonth: {
    revenue: 720,
    appointments: 15,
    newClients: 2,
    averageServicePrice: 48
  },
  // Data for charts
  revenueData: [
    { name: 'Gen', value: 580 },
    { name: 'Feb', value: 650 },
    { name: 'Mar', value: 720 },
    { name: 'Apr', value: 850 },
  ],
  servicesData: [
    { name: 'Manicure', value: 35 },
    { name: 'Pedicure', value: 20 },
    { name: 'Nail Art', value: 25 },
    { name: 'Ceretta', value: 15 },
    { name: 'Viso', value: 5 },
  ]
};
