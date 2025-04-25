
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { mockClients } from "@/data/mockData";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  { id: "s1", name: "Manicure classica", price: 25 },
  { id: "s2", name: "Smalto semipermanente", price: 35 },
  { id: "s3", name: "Ricostruzione unghie", price: 50 },
  { id: "s4", name: "Pedicure", price: 30 },
  { id: "s5", name: "Nail art", price: 15 },
  { id: "s6", name: "Ceretta", price: 25 },
  { id: "s7", name: "Trattamento viso", price: 40 },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

const NewAppointment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
    const service = services.find(s => s.id === value);
    if (service) {
      setPrice(service.price.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!date || !selectedTime || (!selectedClient && !newClientName)) {
      toast({
        title: "Campi obbligatori mancanti",
        description: "Compila tutti i campi richiesti",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, here we would save the appointment to a database
    toast({
      title: "Appuntamento creato!",
      description: "L'appuntamento è stato aggiunto con successo"
    });
    
    navigate("/appointments");
  };

  return (
    <Layout title="Nuovo Appuntamento">
      <div className="space-y-6 animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <h2 className="text-lg font-medium">Data e Ora</h2>
            
            <div className="space-y-2">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Seleziona una data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Ora</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Seleziona orario" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Cliente</h2>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => setShowNewClientForm(!showNewClientForm)}
              >
                {showNewClientForm ? "Seleziona esistente" : "Nuovo cliente"}
              </Button>
            </div>
            
            {!showNewClientForm ? (
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona cliente" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} - {client.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2">
                <div>
                  <Label htmlFor="newClientName">Nome e Cognome</Label>
                  <Input
                    id="newClientName"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="newClientPhone">Telefono</Label>
                  <Input
                    id="newClientPhone"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-medium">Servizio</h2>
            
            <div>
              <Label htmlFor="service">Tipo di servizio</Label>
              <Select value={selectedService} onValueChange={handleServiceChange}>
                <SelectTrigger id="service">
                  <SelectValue placeholder="Seleziona servizio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - {service.price}€
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="price">Prezzo (€)</Label>
              <Input
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Note</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Aggiungi note o preferenze del cliente..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="pt-5">
            <Button 
              type="submit" 
              className="w-full bg-beauty-purple hover:bg-beauty-purple/90"
            >
              Crea Appuntamento
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NewAppointment;
