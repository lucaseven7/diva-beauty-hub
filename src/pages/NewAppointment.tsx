
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { services } from "@/data/services";
import { timeSlots, getAvailableTimeSlots } from "@/data/timeSlots";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getClients, getAppointments, addAppointment, updateAppointment } from "@/services/localStorage";

const NewAppointment = () => {
  const { id } = useParams();
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");
  const [clients, setClients] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState(timeSlots);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Carica i clienti dal localStorage
    const storedClients = getClients();
    setClients(storedClients);
    
    // Verifica se siamo in modalità modifica
    if (id) {
      setIsEditMode(true);
      setAppointmentId(id);
      
      // Carica i dati dell'appuntamento esistente
      const storedAppointments = getAppointments();
      const appointmentToEdit = storedAppointments.find(appt => appt.id === id);
      
      if (appointmentToEdit) {
        // Imposta i valori del form con i dati dell'appuntamento
        if (appointmentToEdit.date) {
          setDate(new Date(appointmentToEdit.date));
        }
        setSelectedClient(appointmentToEdit.clientId);
        setSelectedTime(appointmentToEdit.time);
        setPrice(appointmentToEdit.price.toString());
        setNotes(appointmentToEdit.notes || "");
        
        // Trova il servizio corrispondente
        const service = services.find(s => s.name === appointmentToEdit.service);
        if (service) {
          setSelectedService(service.id);
        }
      } else {
        // Appuntamento non trovato
        toast({
          title: "Errore",
          description: "Appuntamento non trovato",
          variant: "destructive"
        });
        navigate("/appointments");
      }
    }
  }, [id, navigate, toast]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!date || !selectedTime || !selectedClient || !selectedService || !price) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi obbligatori",
        variant: "destructive",
      });
      return;
    }
    
    // Trova il cliente selezionato
    const client = clients.find(c => c.id === selectedClient);
    
    if (!client) {
      toast({
        title: "Errore",
        description: "Seleziona un cliente valido",
        variant: "destructive"
      });
      return;
    }
    
    // Trova il servizio selezionato
    const service = services.find(s => s.id === selectedService);
    
    // Crea o aggiorna l'appuntamento
    const appointmentData = {
      id: isEditMode ? appointmentId : `appt-${Date.now()}`,
      date: date ? format(date, "yyyy-MM-dd") : "",
      time: selectedTime,
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone,
      clientAvatar: client.avatar,
      service: service ? service.name : "",
      price: parseInt(price),
      notes: notes,
      status: "scheduled"
    };
    
    // Salva l'appuntamento nel localStorage
    if (isEditMode) {
      // Aggiorna l'appuntamento esistente
      updateAppointment(appointmentData);
      
      toast({
        title: "Appuntamento aggiornato",
        description: "L'appuntamento è stato aggiornato con successo",
      });
    } else {
      // Crea un nuovo appuntamento
      addAppointment(appointmentData);
      
      toast({
        title: "Appuntamento creato",
        description: "L'appuntamento è stato creato con successo",
      });
    }
    
    navigate("/appointments");
  };

  return (
    <Layout title={isEditMode ? "Modifica Appuntamento" : "Nuovo Appuntamento"}>
      <div className="space-y-6 animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <h2 className="text-lg font-medium">Data e Ora</h2>
            
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
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
                    {date ? (
                      format(date, "PPP", { locale: it })
                    ) : (
                      <span>Seleziona una data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={it}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Ora *</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona orario" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableTimeSlots.length === 0 && date && (
                <p className="text-sm text-red-500 mt-1">
                  Non ci sono orari disponibili per questa data. Seleziona un'altra data.
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-lg font-medium">Cliente</h2>
            
            <div className="space-y-2">
              <Label htmlFor="client">Cliente *</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} - {client.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-beauty-purple"
                onClick={() => navigate("/clients/new")}
              >
                Nuovo cliente
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-lg font-medium">Servizio</h2>
            
            <div className="space-y-2">
              <Label htmlFor="service">Servizio *</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
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
            
            <div className="space-y-2">
              <Label htmlFor="price">Prezzo (€) *</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
              />
              {selectedService && (
                <p className="text-sm text-muted-foreground mt-1">
                  Prezzo suggerito: {services.find(s => s.id === selectedService)?.price}€
                </p>
              )}
            </div>
            
            <div className="space-y-2">
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
              {isEditMode ? "Aggiorna Appuntamento" : "Crea Appuntamento"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NewAppointment;
