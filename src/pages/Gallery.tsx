
import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { mockAppointments } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Camera, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Gallery = () => {
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [newPhoto, setNewPhoto] = useState(null);
  
  // Filter appointments that have images
  const appointmentsWithImages = mockAppointments.filter(
    (appt) => appt.imageUrl && appt.status === "completed"
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhoto(reader.result);
        toast({
          title: "Foto caricata",
          description: "La foto è stata aggiunta alla galleria",
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

  return (
    <Layout title="Galleria">
      <div className="space-y-6 animate-fade-in">
        <Tabs defaultValue="gallery">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="gallery">Galleria</TabsTrigger>
            <TabsTrigger value="camera">Nuova foto</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gallery" className="mt-4">
            {appointmentsWithImages.length > 0 || newPhoto ? (
              <div className="grid grid-cols-2 gap-3">
                {newPhoto && (
                  <Card className="overflow-hidden">
                    <img
                      src={newPhoto}
                      alt="Nuovo lavoro"
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-2">
                      <p className="text-sm font-medium truncate">Nuovo lavoro</p>
                      <p className="text-xs text-muted-foreground">Oggi</p>
                    </div>
                  </Card>
                )}
                
                {appointmentsWithImages.map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <img
                      src={appointment.imageUrl}
                      alt={appointment.service}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-2">
                      <p className="text-sm font-medium truncate">
                        {appointment.service}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.clientName}
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
                <Button className="w-full mt-4 bg-beauty-purple hover:bg-beauty-purple/90">
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
