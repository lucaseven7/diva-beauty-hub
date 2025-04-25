
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { AppointmentCard } from "@/components/AppointmentCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAppointments } from "@/data/mockData";
import { Link } from "react-router-dom";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { it } from "date-fns/locale";

const Appointments = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const today = new Date();

  useEffect(() => {
    // Split appointments into upcoming and past
    const upcoming = mockAppointments.filter((appt) => 
      new Date(`${appt.date}T${appt.time}`) >= today && appt.status !== "cancelled"
    );
    const past = mockAppointments.filter((appt) => 
      new Date(`${appt.date}T${appt.time}`) < today || appt.status === "completed"
    );
    
    setUpcomingAppointments(upcoming);
    setPastAppointments(past);
  }, []);

  // Generate dates for the next 5 days
  const days = [0, 1, 2, 3, 4].map((i) => {
    const date = addDays(today, i);
    return {
      date,
      formattedDay: format(date, "d", { locale: it }),
      formattedWeekday: format(date, "EEE", { locale: it }).toUpperCase(),
      dateString: format(date, "yyyy-MM-dd")
    };
  });

  const [selectedDate, setSelectedDate] = useState(days[0].dateString);

  const filteredAppointments = upcomingAppointments.filter(
    (appt) => appt.date === selectedDate
  );

  return (
    <Layout title="Appuntamenti">
      <div className="space-y-6 animate-fade-in">
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

        <Tabs defaultValue="upcoming">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="upcoming">Futuri</TabsTrigger>
            <TabsTrigger value="past">Passati</TabsTrigger>
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
