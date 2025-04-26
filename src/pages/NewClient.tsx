import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addClient } from "@/services/localStorage";

const NewClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || !phone) {
      toast({
        title: "Errore",
        description: "Nome e telefono sono campi obbligatori",
        variant: "destructive"
      });
      return;
    }
    
    // Crea un nuovo cliente
    const newClient = {
      id: `client-${Date.now()}`,
      name,
      phone,
      email,
      notes,
      preferences: []
    };
    
    // Salva il cliente nel localStorage
    addClient(newClient);
    
    toast({
      title: "Cliente aggiunto",
      description: "Il cliente è stato aggiunto con successo",
    });
    
    navigate("/clients");
  };

  return (
    <Layout title="Nuovo Cliente">
      <div className="space-y-6 animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <h2 className="text-lg font-medium">Informazioni cliente</h2>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nome e Cognome *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefono *</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Note</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Preferenze, note o altre informazioni..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="pt-5">
            <Button 
              type="submit" 
              className="w-full bg-beauty-purple hover:bg-beauty-purple/90"
            >
              Aggiungi Cliente
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NewClient;