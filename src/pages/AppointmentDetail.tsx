
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { mockAppointments } from "@/data/mockData";
import {
  Calendar,
  Clock,
  Euro,
  Phone,
  Camera,
  Pencil,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
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

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointment, setAppointment] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Find the appointment in our mock data
    const found = mockAppointments.find((appt) => appt.id === id);
    if (found) {
      setAppointment(found);
      if (found.imageUrl) {
        setImagePreview(found.imageUrl);
      }
    } else {
      // Appointment not found, redirect
      navigate("/appointments");
      toast({
        title: "Appuntamento non trovato",
        variant: "destructive",
      });
    }
  }, [id]);

  const handleDelete = () => {
    // In a real app, we would delete from the database
    toast({
      title: "Appuntamento cancellato",
      description: "L'appuntamento è stato cancellato con successo",
    });
    navigate("/appointments");
  };

  const handleCompleted = () => {
    toast({
      title: "Appuntamento completato",
      description: "L'appuntamento è stato segnato come completato",
    });
    navigate("/appointments");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // In a real app, we would upload the image to a server
      toast({
        title: "Immagine caricata",
        description: "L'immagine è stata salvata con successo",
      });
      setShowImageUpload(false);
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

  const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
  const isPast = appointmentDate < new Date();

  return (
    <Layout title="Dettaglio Appuntamento">
      <div className="space-y-6 animate-fade-in pb-8">
        <div className="beauty-card">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={appointment.clientAvatar} />
              <AvatarFallback className="bg-beauty-purple/20 text-beauty-purple">
                {appointment.clientName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold font-playfair">
                {appointment.clientName}
              </h2>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-3 w-3 mr-1" />
                <span>{appointment.clientPhone}</span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Servizio</Label>
              <p className="font-medium">{appointment.service}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Prezzo</Label>
              <p className="font-medium">{appointment.price}€</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Data</Label>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1 text-beauty-purple" />
                <p className="font-medium">
                  {format(new Date(appointment.date), "d MMMM yyyy", {
                    locale: it,
                  })}
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
          </div>

          {appointment.notes && (
            <>
              <Separator className="my-4" />
              <div>
                <Label className="text-xs text-muted-foreground">Note</Label>
                <p className="mt-1 text-sm">{appointment.notes}</p>
              </div>
            </>
          )}
        </div>

        <div className="beauty-card">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Foto del lavoro</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImageUpload(true)}
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

          {imagePreview ? (
            <div className="mt-4 rounded-md overflow-hidden">
              <img
                src={imagePreview}
                alt="Risultato del lavoro"
                className="w-full h-auto object-cover"
              />
            </div>
          ) : (
            <div className="mt-4 border border-dashed border-gray-300 rounded-md p-8 text-center">
              <p className="text-muted-foreground text-sm">
                Nessuna foto caricata
              </p>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => navigate(`/appointments/edit/${id}`)}
          >
            <Pencil className="h-4 w-4 mr-2" /> Modifica
          </Button>
          <Button
            className="flex-1"
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Cancella
          </Button>
        </div>

        {!isPast && appointment.status !== "completed" && (
          <Button
            className="w-full bg-beauty-purple hover:bg-beauty-purple/90"
            onClick={handleCompleted}
          >
            Segna come completato
          </Button>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. L'appuntamento verrà
              eliminato definitivamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default AppointmentDetail;
