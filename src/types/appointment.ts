
export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  clientPhone: string;
  service: string;
  price: number;
  date: string;
  time: string;
  notes?: string;
  imageUrl?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}
