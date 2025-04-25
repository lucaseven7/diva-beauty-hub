
import { Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Client } from "@/types/client";
import { Link } from "react-router-dom";

interface ClientCardProps {
  client: Client;
  className?: string;
}

export const ClientCard = ({ client, className }: ClientCardProps) => {
  const initials = client.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Link to={`/clients/${client.id}`}>
      <Card className={cn("cursor-pointer hover:shadow-md transition-shadow", className)}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={client.avatar} />
              <AvatarFallback className="bg-beauty-purple/20 text-beauty-purple">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{client.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Phone className="h-3 w-3 mr-1" />
                <span>{client.phone}</span>
              </div>
            </div>
          </div>
          <div className="mt-2 text-sm">
            <span className="text-muted-foreground">
              {client.totalVisits} {client.totalVisits === 1 ? 'visita' : 'visite'} • 
              Ultimo: {client.lastVisit}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
