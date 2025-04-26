import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getAppointments } from '@/services/localStorage';

interface CalendarProps {
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
}

export const Calendar = ({ selectedDate, onSelectDate }: CalendarProps) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const firstDayCurrentMonth = startOfMonth(currentMonth);
  const appointments = getAppointments();
  console.log("Appuntamenti caricati:", appointments);
  
  // Funzioni per la navigazione del calendario
  const prevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  // Genera i giorni del mese corrente con padding per iniziare dal lunedì
  const startDay = startOfMonth(currentMonth);
  const endDay = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: startDay, end: endDay });
  
  // Calcola i giorni da aggiungere prima e dopo per completare le settimane
  const startDayOfWeek = getDay(startDay) || 7; // 0 è domenica, vogliamo 7
  const endDayOfWeek = getDay(endDay);
  
  // Aggiungi giorni dal mese precedente
  const prevMonthDays = Array.from({ length: startDayOfWeek - 1 }, (_, i) => {
    const d = new Date(startDay);
    d.setDate(d.getDate() - (startDayOfWeek - 1 - i));
    return d;
  });
  
  // Aggiungi giorni dal mese successivo
  const nextMonthDays = Array.from({ length: 7 - endDayOfWeek }, (_, i) => {
    const d = new Date(endDay);
    d.setDate(d.getDate() + i + 1);
    return d;
  });
  
  // Combina tutti i giorni
  const calendarDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];
  
  // Funzione per determinare il colore dell'indicatore di occupazione
  const getDayOccupancyStyle = (date) => {
    // Filtra gli appuntamenti per la data specifica
    const dayAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      );
    });
    
    // Determina il colore in base al numero di appuntamenti
    const count = dayAppointments.length;
    
    if (count === 0 || count === 1) {
      return "bg-green-100 hover:bg-green-200"; 
    } else if (count === 2) {
      return "bg-yellow-100 hover:bg-yellow-200"; 
    } else {
      return "bg-red-100 hover:bg-red-200"; 
    }
  };

  return (
    <div className="beauty-card p-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="sm" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-medium capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: it })}
        </h3>
        <Button variant="outline" size="sm" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map((day) => (
          <div key={day} className="text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 mt-1">
        {calendarDays.map((day) => {
          const isCurrentMonth = isSameMonth(day, firstDayCurrentMonth);
          const isSelectedDay = selectedDate ? isSameDay(day, selectedDate) : false;
          const occupancyStyle = isCurrentMonth ? getDayOccupancyStyle(day) : "";
          
          return (
            <Button
              key={day.toString()}
              variant={isSelectedDay ? "default" : "ghost"}
              className={cn(
                "h-10 w-10 p-0 font-normal rounded-full",
                !isCurrentMonth && "text-muted-foreground opacity-50",
                isToday(day) && !isSelectedDay && "border border-beauty-purple text-beauty-purple",
                isSelectedDay && "bg-beauty-purple text-white hover:bg-beauty-purple/90",
                !isSelectedDay && isCurrentMonth && occupancyStyle,
                "transition-colors"
              )}
              onClick={() => onSelectDate && onSelectDate(day)}
            >
              <time dateTime={format(day, "yyyy-MM-dd")}>
                {format(day, "d")}
              </time>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;