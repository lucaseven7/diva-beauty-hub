
import { Calendar, Clock, Euro } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Appointment } from "@/types/appointment";
import { Link } from "react-router-dom";

interface AppointmentCardProps {
  appointment: Appointment;
  className?: string;
}

export const AppointmentCard = ({ appointment, className }: AppointmentCardProps) => {
  const initials = appointment.clientName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Link to={`/appointments/${appointment.id}`}>
      <Card className={cn("cursor-pointer hover:shadow-md transition-shadow", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={appointment.clientAvatar} />
                <AvatarFallback className="bg-beauty-purple/20 text-beauty-purple">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{appointment.clientName}</h3>
                <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                  {appointment.service}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{appointment.price}€</div>
            </div>
          </div>
          
          <div className="flex items-center mt-3 space-x-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {format(new Date(appointment.date), "d MMMM", { locale: it })}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{appointment.time}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
