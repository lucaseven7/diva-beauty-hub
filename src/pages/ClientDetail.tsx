
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppointmentCard } from "@/components/AppointmentCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getClients, getAppointments, getClient, updateClient } from "@/services/localStorage";
import { Phone, Mail, Calendar, Pencil, Clock, Euro, Camera, Image as ImageIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState(null);
  const [clientAppointments, setClientAppointments] = useState([]);
  const [appointmentStats, setAppointmentStats] = useState({
    total: 0,
    completed: 0,
    upcoming: 0,
    totalSpent: 0,
    averageSpent: 0,
    favoriteServices: []
  });
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [clientPhotos, setClientPhotos] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState("Generale");
  const [newAlbumName, setNewAlbumName] = useState("");
  const [showNewAlbumForm, setShowNewAlbumForm] = useState(false);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    // Trova il cliente nel localStorage
    const foundClient = getClient(id);
    
    if (foundClient) {
      setClient(foundClient);
      
      // Trova tutti gli appuntamenti per questo cliente
      const appointments = getAppointments().filter(
        (appt) => appt.clientId === id
      );
      setClientAppointments(appointments);
      
      // Calcola le statistiche degli appuntamenti
      calculateAppointmentStats(appointments);
      
      // Carica le foto del cliente
      if (foundClient.photos && foundClient.photos.length > 0) {
        setClientPhotos(foundClient.photos);
      }
    } else {
      // Cliente non trovato, reindirizza
      navigate("/clients");
      toast({
        title: "Cliente non trovato",
        variant: "destructive",
      });
    }
  }, [id, navigate, toast]);
  
  const calculateAppointmentStats = (appointments) => {
    if (!appointments.length) return;
    
    const today = new Date();
    const completed = appointments.filter(a => a.status === "completed");
    const upcoming = appointments.filter(a => new Date(a.date) >= today && a.status === "scheduled");
    const totalSpent = completed.reduce((sum, a) => sum + (a.price || 0), 0);
    
    // Calcola i servizi preferiti
    const serviceCount = {};
    appointments.forEach(a => {
      if (!a.service) return;
      serviceCount[a.service] = (serviceCount[a.service] || 0) + 1;
    });
    
    // Ordina i servizi per frequenza
    const favoriteServices = Object.entries(serviceCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
    
    setAppointmentStats({
      total: appointments.length,
      completed: completed.length,
      upcoming: upcoming.length,
      totalSpent,
      averageSpent: completed.length ? Math.round(totalSpent / completed.length) : 0,
      favoriteServices
    });
  };

  if (!client) {
    return (
      <Layout title="Dettaglio Cliente">
        <div className="flex justify-center items-center h-40">
          <p>Caricamento...</p>
        </div>
      </Layout>
    );
  }

  const initials = client.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setImagePreview(imageData);
        
        // Aggiungi la nuova foto all'array delle foto del cliente
        const newPhoto = {
          id: `photo-${Date.now()}`,
          url: imageData,
          date: new Date().toISOString(),
          description: "Foto cliente",
          album: selectedAlbum
        };
        
        // Crea un array aggiornato di foto
        const updatedPhotos = [...(clientPhotos || []), newPhoto];
        
        // Aggiorna lo stato locale
        setClientPhotos(updatedPhotos);
        
        // Aggiorna il cliente nel localStorage
        const updatedClient = {
          ...client,
          photos: updatedPhotos
        };
        
        // Usa la funzione updateClient per aggiornare il cliente
        const result = updateClient(updatedClient);
        
        if (result) {
          setClient(updatedClient);
          toast({
            title: "Foto aggiunta",
            description: "La foto è stata aggiunta con successo",
          });
        } else {
          toast({
            title: "Errore",
            description: "Impossibile salvare la foto",
            variant: "destructive"
          });
        }
        
        setShowImageUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const createNewAlbum = () => {
    if (!newAlbumName.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci un nome per l'album",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedAlbum(newAlbumName);
    setNewAlbumName("");
    setShowNewAlbumForm(false);
    
    toast({
      title: "Album creato",
      description: `L'album "${newAlbumName}" è stato creato`
    });
  };

  // Ottieni gli album unici dalle foto
  const getUniqueAlbums = () => {
    if (!clientPhotos || clientPhotos.length === 0) return ["Generale"];
    
    const albums = clientPhotos.map(photo => photo.album || "Generale");
    return [...new Set(albums)];
  };
  
  // Filtra le foto in base all'album selezionato
  const getFilteredPhotos = () => {
    if (!clientPhotos) return [];
    if (selectedAlbum === "all") return clientPhotos;
    
    return clientPhotos.filter(photo => photo.album === selectedAlbum);
  };

  return (
    <Layout title="Dettaglio Cliente">
      <div className="space-y-6 animate-fade-in">
        {/* Sezione informazioni cliente */}
        <div className="beauty-card">
          <div className="flex justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={client.avatar} />
                <AvatarFallback className="bg-beauty-purple/20 text-beauty-purple">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold font-playfair">
                  {client.name}
                </h2>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Phone className="h-3 w-3 mr-1" />
                  <span>{client.phone}</span>
                </div>
                {client.email && (
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Mail className="h-3 w-3 mr-1" />
                    <span>{client.email}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/clients/edit/${id}`)}
              >
                <Pencil className="h-4 w-4 mr-1" /> Modifica
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <Label className="text-xs text-muted-foreground">Storico visite</Label>
            <div className="flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1 text-beauty-purple" />
              <p>{client.totalVisits} visite • Ultima: {client.lastVisit}</p>
            </div>
          </div>

          {client.preferences && client.preferences.length > 0 && (
            <>
              <Separator className="my-4" />
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Preferenze</Label>
                <div className="flex flex-wrap gap-2">
                  {client.preferences.map((pref, index) => (
                    <Badge key={index} variant="outline" className="bg-beauty-purple/10">
                      {pref}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {client.notes && (
            <>
              <Separator className="my-4" />
              <div>
                <Label className="text-xs text-muted-foreground">Note</Label>
                <p className="mt-1 text-sm">{client.notes}</p>
              </div>
            </>
          )}
        </div>

        {/* Nuova sezione: Riepilogo appuntamenti */}
        <div className="beauty-card">
          <h3 className="text-lg font-medium mb-4">Riepilogo Appuntamenti</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Appuntamenti Totali</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appointmentStats.total}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Appuntamenti Futuri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appointmentStats.upcoming}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Spesa Totale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€{appointmentStats.totalSpent}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Spesa Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€{appointmentStats.averageSpent}</div>
              </CardContent>
            </Card>
          </div>
          
          {appointmentStats.favoriteServices.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Servizi Preferiti</h4>
              <div className="flex flex-wrap gap-2">
                {appointmentStats.favoriteServices.map((service, index) => (
                  <Badge key={index} variant="outline" className="bg-beauty-purple/10">
                    {service.name} ({service.count})
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <Tabs defaultValue="appointments">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="appointments">Appuntamenti</TabsTrigger>
            <TabsTrigger value="gallery">Galleria</TabsTrigger>
          </TabsList>
          <TabsContent value="appointments" className="space-y-4 mt-4">
            {clientAppointments.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Cronologia Appuntamenti</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/appointments/new")}
                  >
                    Nuovo
                  </Button>
                </div>
                {clientAppointments
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
              </>
            ) : (
              <div className="beauty-card text-center py-8">
                <p className="text-muted-foreground">Nessun appuntamento per questo cliente</p>
                <Button 
                  className="mt-3 bg-beauty-purple hover:bg-beauty-purple/90"
                  onClick={() => navigate("/appointments/new")}
                >
                  Crea appuntamento
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="gallery" className="mt-4">
            <div className="beauty-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Galleria foto</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCameraClick}
                >
                  <Camera className="h-4 w-4 mr-1" /> Aggiungi foto
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              {getUniqueAlbums().length > 1 && (
                <div className="mb-4">
                  <Label htmlFor="album-select" className="mb-2 block">Album</Label>
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    <Button
                      variant={selectedAlbum === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedAlbum("all")}
                    >
                      Tutti
                    </Button>
                    {getUniqueAlbums().map((album) => (
                      <Button
                        key={album}
                        variant={selectedAlbum === album ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedAlbum(album)}
                      >
                        {album}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {clientPhotos && clientPhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {(selectedAlbum === "all" ? clientPhotos : getFilteredPhotos()).map((photo) => (
                    <div key={photo.id} className="rounded-md overflow-hidden">
                      <img
                        src={photo.url}
                        alt={`Foto di ${client.name}`}
                        className="w-full h-32 object-cover"
                      />
                      <p className="text-xs mt-1 text-center text-muted-foreground">
                        {photo.description || photo.album || "Foto cliente"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nessuna foto disponibile per questo cliente
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ClientDetail;
