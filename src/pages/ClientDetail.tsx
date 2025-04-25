
import { useState, useEffect } from "react";
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
import { mockClients, mockAppointments } from "@/data/mockData";
import { Phone, Mail, Pencil, Calendar } from "lucide-react";

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState(null);
  const [clientAppointments, setClientAppointments] = useState([]);

  useEffect(() => {
    // Find the client in our mock data
    const foundClient = mockClients.find((c) => c.id === id);
    if (foundClient) {
      setClient(foundClient);
      
      // Find all appointments for this client
      const appointments = mockAppointments.filter(
        (appt) => appt.clientId === id
      );
      setClientAppointments(appointments);
    } else {
      // Client not found, redirect
      navigate("/clients");
      toast({
        title: "Cliente non trovato",
        variant: "destructive",
      });
    }
  }, [id]);

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

  return (
    <Layout title="Dettaglio Cliente">
      <div className="space-y-6 animate-fade-in">
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

        <Tabs defaultValue="appointments">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="appointments">Appuntamenti</TabsTrigger>
            <TabsTrigger value="gallery">Galleria</TabsTrigger>
          </TabsList>
          <TabsContent value="appointments" className="space-y-4 mt-4">
            {clientAppointments.length > 0 ? (
              clientAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
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
              {clientAppointments.some(appt => appt.imageUrl) ? (
                <div className="grid grid-cols-2 gap-3">
                  {clientAppointments
                    .filter(appt => appt.imageUrl)
                    .map((appt) => (
                      <div key={appt.id} className="rounded-md overflow-hidden">
                        <img
                          src={appt.imageUrl}
                          alt={`Lavoro per ${client.name}`}
                          className="w-full h-32 object-cover"
                        />
                        <p className="text-xs mt-1 text-center text-muted-foreground">
                          {appt.service}
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

        <div className="pt-4">
          <Button 
            className="w-full bg-beauty-purple hover:bg-beauty-purple/90"
            onClick={() => navigate("/appointments/new")}
          >
            Nuovo appuntamento
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ClientDetail;
