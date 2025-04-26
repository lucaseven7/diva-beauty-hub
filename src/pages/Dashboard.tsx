import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentCard } from "@/components/AppointmentCard";
import { ClientCard } from "@/components/ClientCard";
import { getAppointments, getClients } from "@/services/localStorage";
import { format, isToday, isTomorrow, isThisWeek, parseISO, compareDesc, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { it } from "date-fns/locale";
// Modifica gli import per includere tutti i componenti necessari
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentClients, setRecentClients] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    totalRevenue: 0,
    totalClients: 0
  });
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    // Carica i dati reali dal localStorage
    const appointments = getAppointments();
    const clients = getClients();
    
    // Filtra gli appuntamenti di oggi
    const today = appointments.filter(appt => {
      const apptDate = new Date(appt.date);
      return isToday(apptDate);
    });
    setTodayAppointments(today);
    
    // Filtra gli appuntamenti futuri (escludendo oggi)
    const upcoming = appointments.filter(appt => {
      const apptDate = new Date(appt.date);
      return (isTomorrow(apptDate) || (isThisWeek(apptDate) && !isToday(apptDate))) && 
             appt.status === 'scheduled';
    }).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }).slice(0, 3); // Prendi solo i prossimi 3
    setUpcomingAppointments(upcoming);
    
    // Prendi i clienti più recenti
    const sortedClients = [...clients].sort((a, b) => {
      // Se un cliente ha lastVisit, usalo per ordinare
      if (a.lastVisit && b.lastVisit) {
        if (a.lastVisit === 'Mai') return 1;
        if (b.lastVisit === 'Mai') return -1;
        return compareDesc(new Date(a.lastVisit), new Date(b.lastVisit));
      }
      // Altrimenti, metti i clienti senza lastVisit in fondo
      if (!a.lastVisit) return 1;
      if (!b.lastVisit) return -1;
      return 0;
    }).slice(0, 3); // Prendi solo i 3 più recenti
    setRecentClients(sortedClients);
    
    // Calcola le statistiche
    const completedAppts = appointments.filter(appt => appt.status === 'completed');
    const totalRevenue = completedAppts.reduce((sum, appt) => sum + appt.price, 0);
    
    setStats({
      totalAppointments: appointments.length,
      completedAppointments: completedAppts.length,
      totalRevenue: totalRevenue,
      totalClients: clients.length
    });
    
    // Prepara i dati per i grafici
    prepareChartData(appointments);
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
    <Layout title="Dashboard">
      <div className="space-y-6 animate-fade-in pb-[120px] md:pb-0">
        {/* Statistiche */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Appuntamenti Totali</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Appuntamenti Completati</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedAppointments}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Entrate Totali</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.totalRevenue}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Clienti Totali</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
            </CardContent>
          </Card>
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
        
        {/* Appuntamenti di oggi */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold font-playfair">Appuntamenti di Oggi</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/appointments/new")}
            >
              Nuovo Appuntamento
            </Button>
          </div>
          
          {todayAppointments.length > 0 ? (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-muted-foreground">Nessun appuntamento per oggi</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Prossimi appuntamenti */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold font-playfair">Prossimi Appuntamenti</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/appointments")}
            >
              Vedi Tutti
            </Button>
          </div>
          
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-muted-foreground">Nessun appuntamento programmato</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Clienti recenti */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold font-playfair">Clienti Recenti</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/clients")}
            >
              Vedi Tutti
            </Button>
          </div>
          
          {recentClients.length > 0 ? (
            <div className="space-y-4">
              {recentClients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-muted-foreground">Nessun cliente</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
