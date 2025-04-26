
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { StatsCard } from "@/components/StatsCard";
import { AppointmentCard } from "@/components/AppointmentCard";
import { Button } from "@/components/ui/button";
import { Calendar, Euro } from "lucide-react";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { it } from "date-fns/locale";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { getAppointments, getClients } from "@/services/localStorage";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({
    appointments: 0,
    revenue: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const today = new Date();
  const formattedDate = format(today, "EEEE, d MMMM", { locale: it });

  useEffect(() => {
    // Carica gli appointments dal localStorage
    const allAppointments = getAppointments();
    
    // Filtra gli appuntamenti per oggi
    const todaysAppts = allAppointments.filter(
      (appt) => appt.date === format(today, "yyyy-MM-dd") && appt.status === "scheduled"
    );
    setTodayAppointments(todaysAppts);
    
    // Calcola le statistiche del mese corrente
    const firstDayOfMonth = startOfMonth(today);
    const lastDayOfMonth = endOfMonth(today);
    
    // Filtra gli appuntamenti del mese corrente
    const currentMonthAppointments = allAppointments.filter(appt => {
      const apptDate = new Date(appt.date);
      return isWithinInterval(apptDate, { start: firstDayOfMonth, end: lastDayOfMonth });
    });
    
    // Calcola le statistiche
    const totalRevenue = currentMonthAppointments
      .filter(appt => appt.status === "completed")
      .reduce((sum, appt) => sum + (appt.price || 0), 0);
    const totalAppointments = currentMonthAppointments.length;
    
    setMonthlyStats({
      appointments: totalAppointments,
      revenue: totalRevenue
    });
    
    // Prepara i dati per il grafico delle entrate mensili
    prepareChartData(allAppointments);
  }, []);

  const prepareChartData = (appointments) => {
    // Prepara i dati per il grafico delle entrate mensili
    const monthlyRevenue = {};
    
    // Inizializza gli ultimi 4 mesi
    const now = new Date();
    for (let i = 3; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = format(month, 'MMM', { locale: it });
      monthlyRevenue[monthName] = 0;
    }
    
    // Calcola le entrate per ogni mese
    appointments.forEach(appt => {
      if (!appt.date) return;
      
      const apptDate = new Date(appt.date);
      const monthName = format(apptDate, 'MMM', { locale: it });
      
      if (monthlyRevenue[monthName] !== undefined && appt.status === 'completed') {
        monthlyRevenue[monthName] += (appt.price || 0);
      }
    });
    
    // Converti in formato per il grafico
    const revenueChartData = Object.keys(monthlyRevenue).map(month => ({
      name: month,
      value: monthlyRevenue[month]
    }));
    
    setRevenueData(revenueChartData);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in pb-20">
        {/* Il padding-bottom (pb-20) aggiunge spazio sotto l'ultimo elemento per evitare che venga nascosto dalla barra di navigazione */}
        <div>
          <h2 className="text-2xl font-semibold font-playfair">
            Nails.by.bae
          </h2>
          <p className="text-muted-foreground mt-1 capitalize">{formattedDate}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            title="Appuntamenti del mese"
            value={monthlyStats.appointments}
            icon={<Calendar className="h-4 w-4 text-beauty-purple" />}
            trend={null}
          />
          <StatsCard
            title="Entrate del mese"
            value={`${monthlyStats.revenue}€`}
            icon={<Euro className="h-4 w-4 text-beauty-purple" />}
            trend={null}
          />
        </div>

        {/* Grafico delle entrate mensili */}
        <Card className="p-4">
          <h3 className="font-medium mb-4">Entrate mensili</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(value) => [`${value}€`, "Entrate"]} 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
                />
                <Bar dataKey="value" fill="#9b87f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Appuntamenti di oggi</h3>
            <Link to="/appointments">
              <Button variant="ghost" size="sm">
                Vedi tutti
              </Button>
            </Link>
          </div>
          
          {todayAppointments.length > 0 ? (
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment}
                />
              ))}
            </div>
          ) : (
            <div className="beauty-card text-center py-8">
              <p className="text-muted-foreground">Nessun appuntamento oggi</p>
              <Link to="/appointments/new">
                <Button className="mt-3 bg-beauty-purple hover:bg-beauty-purple/90">
                  Nuovo appuntamento
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Assicurati che il pulsante di nuovo appuntamento abbia un z-index più alto della barra di navigazione */}
        <Link to="/appointments/new" className="fixed bottom-20 right-4 z-50">
          <Button size="lg" className="rounded-full h-14 w-14 bg-beauty-purple hover:bg-beauty-purple/90 shadow-lg">
            <span className="text-xl font-bold">+</span>
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default Index;
