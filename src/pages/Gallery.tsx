
import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Camera, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAppointments, getClients, updateAppointment, updateClient } from "@/services/localStorage";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Gallery = () => {
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [newPhoto, setNewPhoto] = useState(null);
  const [appointmentsWithImages, setAppointmentsWithImages] = useState([]);
  const [clientPhotos, setClientPhotos] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedAlbum, setSelectedAlbum] = useState("all");
  const [clients, setClients] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [showNewAlbumForm, setShowNewAlbumForm] = useState(false);
  
  useEffect(() => {
    // Carica gli appuntamenti dal localStorage
    const allAppointments = getAppointments();
    
    // Filtra gli appuntamenti che hanno immagini
    const withImages = allAppointments.filter(
      (appt) => appt.imageUrl && appt.status === "completed"
    );
    setAppointmentsWithImages(withImages);
    
    // Carica i clienti
    const allClients = getClients();
    setClients(allClients);
    
    // Carica le foto dei clienti
    const allClientPhotos = [];
    
    allClients.forEach(client => {
      if (client.photos && client.photos.length > 0) {
        client.photos.forEach(photo => {
          allClientPhotos.push({
            ...photo,
            clientName: client.name,
            clientId: client.id
          });
        });
      }
    });
    
    setClientPhotos(allClientPhotos);
    
    // Carica gli album dal localStorage
    const savedAlbums = localStorage.getItem('albums');
    if (savedAlbums) {
      setAlbums(JSON.parse(savedAlbums));
    } else {
      // Inizializza con un album predefinito
      const defaultAlbums = ["Generale", "Trattamenti"];
      setAlbums(defaultAlbums);
      localStorage.setItem('albums', JSON.stringify(defaultAlbums));
    }
    
    // Carica le foto della galleria dal localStorage
    const savedGalleryPhotos = localStorage.getItem('galleryPhotos');
    if (savedGalleryPhotos) {
      setGalleryPhotos(JSON.parse(savedGalleryPhotos));
    }
  }, []);

  // Ottieni i clienti che hanno foto
  const getClientsWithPhotos = () => {
    const clientIds = new Set(clientPhotos.map(photo => photo.clientId));
    return clients.filter(client => clientIds.has(client.id));
  };
  
  // Ottieni gli album unici per il cliente selezionato
  const getUniqueAlbums = () => {
    if (selectedClient === "all") {
      const albumsFromPhotos = clientPhotos.map(photo => photo.album || "Generale");
      return ["all", ...new Set([...albums, ...albumsFromPhotos])];
    } else {
      const clientPhotosFiltered = clientPhotos.filter(photo => photo.clientId === selectedClient);
      const albumsFromPhotos = clientPhotosFiltered.map(photo => photo.album || "Generale");
      return ["all", ...new Set([...albums, ...albumsFromPhotos])];
    }
  };
  
  // Filtra le foto in base al cliente e all'album selezionati
  const getFilteredPhotos = () => {
    let filtered = [...clientPhotos];
    
    if (selectedClient !== "all") {
      filtered = filtered.filter(photo => photo.clientId === selectedClient);
    }
    
    if (selectedAlbum !== "all") {
      filtered = filtered.filter(photo => photo.album === selectedAlbum);
    }
    
    return filtered;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhoto(reader.result);
        toast({
          title: "Foto caricata",
          description: "Foto pronta per essere salvata nella galleria",
        });
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
    
    const updatedAlbums = [...albums, newAlbumName];
    setAlbums(updatedAlbums);
    localStorage.setItem('albums', JSON.stringify(updatedAlbums));
    
    setSelectedAlbum(newAlbumName);
    setNewAlbumName("");
    setShowNewAlbumForm(false);
    
    toast({
      title: "Album creato",
      description: `L'album "${newAlbumName}" è stato creato`
    });
  };
  
  const handleSavePhoto = () => {
    if (!newPhoto) return;
    
    // Trova il cliente selezionato
    const client = clients.find(c => c.id === selectedClient) || clients[0];
    
    if (!client) {
      toast({
        title: "Errore",
        description: "Seleziona un cliente prima di salvare la foto",
        variant: "destructive"
      });
      return;
    }
    
    // Crea un nuovo oggetto foto
    const newClientPhoto = {
      id: `photo-${Date.now()}`,
      url: newPhoto,
      date: new Date().toISOString(),
      description: "Nuovo lavoro",
      album: selectedAlbum === "all" ? "Generale" : selectedAlbum
    };
    
    // Aggiorna il cliente nel localStorage
    const allClients = getClients();
    const clientIndex = allClients.findIndex(c => c.id === client.id);
    
    if (clientIndex !== -1) {
      // Aggiungi la foto all'array delle foto del cliente
      const updatedClient = {
        ...allClients[clientIndex],
        photos: [...(allClients[clientIndex].photos || []), newClientPhoto]
      };
      
      // Aggiorna il cliente nel localStorage
      updateClient(updatedClient);
      
      // Aggiorna lo stato locale
      setClientPhotos([...clientPhotos, {
        ...newClientPhoto,
        clientName: client.name,
        clientId: client.id
      }]);
    }
    
    // Se è selezionato un appuntamento, aggiorna anche quello
    if (selectedAppointment) {
      const allAppointments = getAppointments();
      const appointmentIndex = allAppointments.findIndex(a => a.id === selectedAppointment);
      
      if (appointmentIndex !== -1) {
        const updatedAppointment = {
          ...allAppointments[appointmentIndex],
          imageUrl: newPhoto
        };
        
        updateAppointment(updatedAppointment);
        
        // Aggiorna la lista degli appuntamenti con immagini
        setAppointmentsWithImages(prev => [...prev, updatedAppointment]);
      }
    }
    
    // Resetta lo stato
    setNewPhoto(null);
    setSelectedAppointment(null);
    
    toast({
      title: "Foto salvata",
      description: "La foto è stata salvata con successo nella galleria",
    });
  };

  return (
    <Layout title="Galleria">
      <div className="space-y-6 animate-fade-in">
        <Tabs defaultValue="gallery">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="gallery">Galleria</TabsTrigger>
            <TabsTrigger value="camera">Nuova foto</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gallery" className="mt-4">
            <div className="beauty-card mb-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="client-select">Cliente</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger id="client-select">
                    <SelectValue placeholder="Seleziona cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti i clienti</SelectItem>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {getUniqueAlbums().length > 1 && (
                <div className="mt-4">
                  <Label htmlFor="album-select">Album</Label>
                  <div className="flex space-x-2 overflow-x-auto pb-2 mt-2">
                    {getUniqueAlbums().map((album) => (
                      <Button
                        key={album}
                        variant={selectedAlbum === album ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedAlbum(album)}
                      >
                        {album === "all" ? "Tutti" : album}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {getFilteredPhotos().length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {getFilteredPhotos().map((photo) => (
                  <Card key={photo.id} className="overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.description || "Foto cliente"}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-2">
                      <p className="text-sm font-medium truncate">
                        {photo.description || "Foto cliente"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {photo.clientName} - {photo.album || "Generale"}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-center text-muted-foreground">
                  Nessuna foto ancora nella galleria
                </p>
                <Button
                  className="mt-4 bg-beauty-purple hover:bg-beauty-purple/90"
                  onClick={() => document.getElementById("tabs-gallery-tab-camera").click()}
                >
                  Aggiungi la tua prima foto
                </Button>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="camera" className="space-y-4 mt-4">
            <Card className="p-4">
              <h3 className="font-medium mb-2">Aggiungi una nuova foto</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Scatta una foto del tuo lavoro o carica un'immagine dalla galleria
              </p>
              
              <div className="space-y-4">
                <Button
                  className="w-full bg-beauty-purple hover:bg-beauty-purple/90 h-12"
                  onClick={handleCameraClick}
                >
                  <Camera className="mr-2 h-5 w-5" /> Scatta una foto
                </Button>
                
                <Separator />
                
                <Button
                  variant="outline"
                  className="w-full h-12"
                  onClick={handleCameraClick}
                >
                  <ImageIcon className="mr-2 h-5 w-5" /> Scegli dalla galleria
                </Button>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </Card>
            
            {newPhoto && (
              <Card className="p-4">
                <h3 className="font-medium mb-2">Anteprima</h3>
                <div className="rounded-md overflow-hidden">
                  <img
                    src={newPhoto}
                    alt="Anteprima"
                    className="w-full h-auto object-cover"
                  />
                </div>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="client-select">Cliente</Label>
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger id="client-select">
                        <SelectValue placeholder="Seleziona cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="album-select">Album</Label>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowNewAlbumForm(!showNewAlbumForm)}
                      >
                        {showNewAlbumForm ? "Seleziona esistente" : "Nuovo album"}
                      </Button>
                    </div>
                    
                    {!showNewAlbumForm ? (
                      <Select value={selectedAlbum} onValueChange={setSelectedAlbum}>
                        <SelectTrigger id="album-select">
                          <SelectValue placeholder="Seleziona album" />
                        </SelectTrigger>
                        <SelectContent>
                          {albums.map(album => (
                            <SelectItem key={album} value={album}>{album}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex space-x-2 mt-2">
                        <Input
                          value={newAlbumName}
                          onChange={(e) => setNewAlbumName(e.target.value)}
                          placeholder="Nome nuovo album"
                        />
                        <Button onClick={createNewAlbum}>Crea</Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4 bg-beauty-purple hover:bg-beauty-purple/90"
                  onClick={handleSavePhoto}
                >
                  Salva nella galleria
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Gallery;
