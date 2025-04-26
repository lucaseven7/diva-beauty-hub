
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { AppointmentCard } from "@/components/AppointmentCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAppointments } from "@/data/mockData";
import { Link } from "react-router-dom";
import { format, addDays, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { it } from "date-fns/locale";
import { getAppointments, initializeStorage } from "@/services/localStorage";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

const Appointments = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [calendarView, setCalendarView] = useState("week"); // "week" o "month"
  
  // Genera date per i prossimi 14 giorni (2 settimane)
  const days = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(today, i);
    return {
      date,
      formattedDay: format(date, "d", { locale: it }),
      formattedWeekday: format(date, "EEE", { locale: it }).toUpperCase(),
      dateString: format(date, "yyyy-MM-dd")
    };
  });

  const [selectedDate, setSelectedDate] = useState(days[0].dateString);

  useEffect(() => {
    // Inizializza lo storage se necessario
    initializeStorage([], mockAppointments);
    
    // Carica gli appuntamenti dal localStorage
    const storedAppointments = getAppointments();
    
    // Dividi gli appuntamenti in futuri e passati
    const today = new Date();
    const upcoming = storedAppointments.filter((appt) => 
      new Date(`${appt.date}T${appt.time}`) >= today && appt.status !== "cancelled"
    );
    const past = storedAppointments.filter((appt) => 
      new Date(`${appt.date}T${appt.time}`) < today || appt.status === "completed"
    );
    
    setUpcomingAppointments(upcoming);
    setPastAppointments(past);
  }, []);

  const filteredAppointments = upcomingAppointments.filter(
    (appt) => appt.date === selectedDate
  );

  // Funzioni per la navigazione del calendario mensile
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

  // Genera i giorni del mese corrente
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  // Ottieni gli appuntamenti per il mese corrente
  const appointmentsInMonth = upcomingAppointments.filter(appt => {
    const apptDate = new Date(appt.date);
    return apptDate.getMonth() === currentMonth.getMonth() && 
           apptDate.getFullYear() === currentMonth.getFullYear();
  });

  return (
    <Layout title="Appuntamenti">
      <div className="space-y-6 animate-fade-in">
        <Tabs defaultValue="week" onValueChange={setCalendarView}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="week">Settimanale</TabsTrigger>
            <TabsTrigger value="month">Mensile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="week">
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
              {days.map((day) => (
                <button
                  key={day.dateString}
                  onClick={() => setSelectedDate(day.dateString)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-lg ${
                    selectedDate === day.dateString 
                      ? "bg-beauty-purple text-white" 
                      : "bg-white border border-gray-100"
                  }`}
                >
                  <span className="text-xs font-medium">{day.formattedWeekday}</span>
                  <span className="text-xl font-bold mt-1">{day.formattedDay}</span>
                </button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="month">
            <div className="beauty-card p-4">
              <div className="flex justify-between items-center mb-4">
                <Button variant="outline" size="sm" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="font-medium">
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
              
              <div className="grid grid-cols-7 gap-1">
                {/* Spazi vuoti per allineare i giorni della settimana */}
                {Array.from({ length: getDay(startOfMonth(currentMonth)) || 7 }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-10" />
                ))}
                
                {daysInMonth.map((day) => {
                  const dateString = format(day, "yyyy-MM-dd");
                  const hasAppointments = appointmentsInMonth.some(
                    appt => appt.date === dateString
                  );
                  const isToday = isSameDay(day, today);
                  const isSelected = dateString === selectedDate;
                  
                  return (
                    <button
                      key={dateString}
                      onClick={() => setSelectedDate(dateString)}
                      className={`h-10 flex items-center justify-center rounded-md text-sm ${
                        isSelected 
                          ? "bg-beauty-purple text-white" 
                          : isToday
                            ? "bg-beauty-purple/20 font-medium"
                            : "hover:bg-gray-100"
                      }`}
                    >
                      {format(day, "d")}
                      {hasAppointments && (
                        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-beauty-purple"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Tabs defaultValue="upcoming">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="upcoming">Futuri</TabsTrigger>
            <TabsTrigger value="past">Completati</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4 mt-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <div className="beauty-card text-center py-8">
                <p className="text-muted-foreground">Nessun appuntamento per questa data</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4 mt-4">
            {pastAppointments.length > 0 ? (
              pastAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <div className="beauty-card text-center py-8">
                <p className="text-muted-foreground">Nessun appuntamento passato</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <Link to="/appointments/new" className="fixed bottom-20 right-4 z-40">
          <Button size="lg" className="rounded-full h-14 w-14 bg-beauty-purple hover:bg-beauty-purple/90 shadow-lg">
            <span className="text-xl font-bold">+</span>
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default Appointments;
