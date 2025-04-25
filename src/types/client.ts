
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
}
