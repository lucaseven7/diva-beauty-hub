
export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  notes?: string;
  totalVisits: number;
  lastVisit: string;
  preferences?: string[];
  gallery?: ClientPhoto[];
}

export interface ClientPhoto {
  id: string;
  imageUrl: string;
  appointmentId: string;
  date: string;
}
