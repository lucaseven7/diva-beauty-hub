
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  Calendar,
  Clock,
  FileText,
  Euro,
  Phone,
  Camera,
  Pencil,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { mockAppointments } from "@/data/mockData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  getAppointments, 
  getClients, 
  updateAppointment, 
  completeAppointment, 
  deleteAppointment 
} from "@/services/localStorage";

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointment, setAppointment] = useState(null);
  const [client, setClient] = useState(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Trova l'appuntamento nel localStorage
    const storedAppointments = getAppointments();
    const foundAppointment = storedAppointments.find((a) => a.id === id);
    
    if (foundAppointment) {
      setAppointment(foundAppointment);
      if (foundAppointment.imageUrl) {
        setImagePreview(foundAppointment.imageUrl);
      }
      
      // Trova il cliente associato
      const storedClients = getClients();
      const foundClient = storedClients.find((c) => c.id === foundAppointment.clientId);
      if (foundClient) {
        setClient(foundClient);
      }
    } else {
      // Appuntamento non trovato, reindirizza
      navigate("/appointments");
      toast({
        title: "Appuntamento non trovato",
        variant: "destructive",
      });
    }
  }, [id, navigate, toast]);

  const handleCompleted = () => {
    if (id) {
      const updatedAppointment = completeAppointment(id);
      if (updatedAppointment) {
        setAppointment(updatedAppointment);
        toast({
          title: "Appuntamento completato",
          description: "L'appuntamento è stato segnato come completato",
        });
        navigate("/appointments");
      } else {
        toast({
          title: "Errore",
          description: "Impossibile completare l'appuntamento",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancel = () => {
    if (id) {
      deleteAppointment(id);
      toast({
        title: "Appuntamento cancellato",
        description: "L'appuntamento è stato cancellato",
      });
      navigate("/appointments");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setImagePreview(imageData);

        // In una app reale, caricheremmo l'immagine su un server
        // Aggiorna l'appuntamento con l'URL dell'immagine
        if (appointment) {
          const updatedAppointment = {
            ...appointment,
            imageUrl: imageData
          };
          
          // Salva l'appuntamento aggiornato
          updateAppointment(updatedAppointment);
          setAppointment(updatedAppointment);
          
          // Aggiungi anche la foto al profilo del cliente
          if (client) {
            const storedClients = getClients();
            const clientIndex = storedClients.findIndex(c => c.id === client.id);
            
            if (clientIndex !== -1) {
              // Crea un nuovo oggetto foto
              const newPhoto = {
                id: `photo-${Date.now()}`,
                url: imageData,
                date: new Date().toISOString(),
                description: appointment.service,
                album: "Trattamenti"
              };
              
              // Aggiungi la foto all'array delle foto del cliente
              const updatedClient = {
                ...storedClients[clientIndex],
                photos: [...(storedClients[clientIndex].photos || []), newPhoto]
              };
              
              // Aggiorna il cliente nel localStorage
              storedClients[clientIndex] = updatedClient;
              localStorage.setItem('clients', JSON.stringify(storedClients));
            }
          }
        }

        toast({
          title: "Immagine caricata",
          description: "L'immagine è stata salvata con successo",
        });
        setShowImageUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!appointment) {
    return (
      <Layout title="Dettaglio Appuntamento">
        <div className="flex justify-center items-center h-40">
          <p>Caricamento...</p>
        </div>
      </Layout>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completato</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancellato</Badge>;
      case "scheduled":
      default:
        return <Badge className="bg-blue-100 text-blue-800">Programmato</Badge>;
    }
  };

  const initials = client?.name
    ? client.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "";

  return (
    <Layout title="Dettaglio Appuntamento">
      <div className="space-y-6 animate-fade-in">
        <div className="beauty-card">
          <div className="flex justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={client?.avatar} />
                <AvatarFallback className="bg-beauty-purple/20 text-beauty-purple">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold font-playfair">
                  {client?.name || "Cliente"}
                </h2>
                {client?.phone && (
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Phone className="h-3 w-3 mr-1" />
                    <span>{client.phone}</span>
                  </div>
                )}
                <div className="mt-2">{getStatusBadge(appointment.status)}</div>
              </div>
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/clients/${client?.id}`)}
              >
                Profilo cliente
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Data</Label>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1 text-beauty-purple" />
                <p className="font-medium">
                  {appointment.date ? format(new Date(appointment.date), "d MMMM yyyy", {
                    locale: it,
                  }) : "Data non disponibile"}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Ora</Label>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1 text-beauty-purple" />
                <p className="font-medium">{appointment.time}</p>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Servizio</Label>
              <p className="font-medium">{appointment.service}</p>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Prezzo</Label>
              <div className="flex items-center">
                <Euro className="h-3 w-3 mr-1 text-beauty-purple" />
                <p className="font-medium">{appointment.price}€</p>
              </div>
            </div>
          </div>

          {appointment.notes && (
            <>
              <Separator className="my-4" />
              <div>
                <Label className="text-xs text-muted-foreground">Note</Label>
                <div className="flex items-start mt-1">
                  <FileText className="h-3 w-3 mr-1 mt-1 text-beauty-purple" />
                  <p>{appointment.notes}</p>
                </div>
              </div>
            </>
          )}

          {appointment.imageUrl && (
            <>
              <Separator className="my-4" />
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Foto
                </Label>
                <img
                  src={appointment.imageUrl}
                  alt="Risultato"
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            </>
          )}
        </div>

        {/* Sezione per caricare una nuova immagine */}
        <div className="beauty-card">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Foto del lavoro</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImageUpload(!showImageUpload)}
            >
              <Camera className="h-4 w-4 mr-1" /> Carica foto
            </Button>
          </div>

          {showImageUpload && (
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full"
              />
            </div>
          )}

          {imagePreview && !appointment.imageUrl && (
            <div className="mt-4 rounded-md overflow-hidden">
              <img
                src={imagePreview}
                alt="Risultato del lavoro"
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/appointments")}
          >
            Indietro
          </Button>
          <Button
            className="flex-1 bg-beauty-purple hover:bg-beauty-purple/90"
            onClick={() => navigate(`/appointments/edit/${id}`)}
          >
            Modifica
          </Button>
        </div>
        
        {appointment.status === 'scheduled' && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
              onClick={() => setShowCancelDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Cancella
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setShowCompleteDialog(true)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Completa
            </Button>
          </div>
        )}
      </div>

      {/* Dialog per confermare il completamento */}
      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Completa appuntamento</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler segnare questo appuntamento come completato?
              Questa azione aggiornerà le statistiche del cliente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCompleted}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Completa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog per confermare la cancellazione */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancella appuntamento</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler cancellare questo appuntamento?
              Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Cancella
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default AppointmentDetail;
