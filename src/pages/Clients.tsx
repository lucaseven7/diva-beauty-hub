
import { useState } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { ClientCard } from "@/components/ClientCard";
import { Button } from "@/components/ui/button";
import { mockClients } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Search, UserPlus } from "lucide-react";

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState(mockClients);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  return (
    <Layout title="Clienti">
      <div className="space-y-6 animate-fade-in">
        <div className="beauty-card">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca clienti..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h3 className="font-medium">
            {filteredClients.length} {filteredClients.length === 1 ? 'cliente' : 'clienti'}
          </h3>
          <Link to="/clients/new">
            <Button size="sm" className="gap-1">
              <UserPlus className="h-4 w-4" />
              <span>Nuovo</span>
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))
          ) : (
            <div className="beauty-card text-center py-8">
              <p className="text-muted-foreground">Nessun cliente trovato</p>
              <Link to="/clients/new">
                <Button className="mt-3 bg-beauty-purple hover:bg-beauty-purple/90">
                  Aggiungi cliente
                </Button>
              </Link>
            </div>
          )}
        </div>

        <Link to="/clients/new" className="fixed bottom-20 right-4 z-40">
          <Button size="lg" className="rounded-full h-14 w-14 bg-beauty-purple hover:bg-beauty-purple/90 shadow-lg">
            <span className="text-xl font-bold">+</span>
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default Clients;
