import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAppointments, getClients } from '@/services/localStorage';
import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';
import { it } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AppointmentCard } from '@/components/AppointmentCard';

const Statistics = () => {
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [currentMonthStats, setCurrentMonthStats] = useState({
    revenue: 0,
    appointments: 0,
    newClients: 0,
    averageServicePrice: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    // Ottieni tutti gli appuntamenti
    const allAppointments = getAppointments();
    
    // Filtra solo gli appuntamenti completati
    const completed = allAppointments.filter(appt => appt.status === 'completed');
    setCompletedAppointments(completed);
    
    // Calcola le statistiche del mese corrente
    calculateCurrentMonthStats(completed);
    
    // Prepara i dati per i grafici
    prepareChartData(completed);
  }, []);

  const calculateCurrentMonthStats = (appointments) => {
    const now = new Date();
    const firstDayOfMonth = startOfMonth(now);
    const lastDayOfMonth = endOfMonth(now);
    
    // Filtra gli appuntamenti del mese corrente
    const currentMonthAppointments = appointments.filter(appt => {
      const apptDate = new Date(appt.date);
      return isWithinInterval(apptDate, { start: firstDayOfMonth, end: lastDayOfMonth });
    });
    
    // Calcola le statistiche
    const totalRevenue = currentMonthAppointments.reduce((sum, appt) => sum + appt.price, 0);
    const totalAppointments = currentMonthAppointments.length;
    
    // Calcola il prezzo medio del servizio
    const averagePrice = totalAppointments > 0 
      ? Math.round(totalRevenue / totalAppointments) 
      : 0;
    
    // Ottieni i clienti unici di questo mese
    const uniqueClientIds = [...new Set(currentMonthAppointments.map(appt => appt.clientId))];
    
    setCurrentMonthStats({
      revenue: totalRevenue,
      appointments: totalAppointments,
      newClients: uniqueClientIds.length,
      averageServicePrice: averagePrice
    });
  };

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
      const apptDate = new Date(appt.date);
      const monthName = format(apptDate, 'MMM', { locale: it });
      
      if (monthlyRevenue[monthName] !== undefined) {
        monthlyRevenue[monthName] += appt.price;
      }
    });
    
    // Converti in formato per il grafico
    const revenueChartData = Object.keys(monthlyRevenue).map(month => ({
      name: month,
      value: monthlyRevenue[month]
    }));
    
    setRevenueData(revenueChartData);
    
    // Prepara i dati per il grafico dei servizi
    const services = {};
    appointments.forEach(appt => {
      if (!services[appt.service]) {
        services[appt.service] = 0;
      }
      services[appt.service]++;
    });
    
    const servicesChartData = Object.keys(services).map(service => ({
      name: service,
      value: services[service]
    }));
    
    setServicesData(servicesChartData);
  };

  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

  return (
    <Layout title="Statistiche">
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Entrate Totali</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{currentMonthStats.revenue}</div>
              <p className="text-xs text-muted-foreground">
                Questo mese
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Appuntamenti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentMonthStats.appointments}</div>
              <p className="text-xs text-muted-foreground">
                Completati questo mese
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Nuovi Clienti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentMonthStats.newClients}</div>
              <p className="text-xs text-muted-foreground">
                Questo mese
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Prezzo Medio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{currentMonthStats.averageServicePrice}</div>
              <p className="text-xs text-muted-foreground">
                Per servizio
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="revenue">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="revenue">Entrate</TabsTrigger>
            <TabsTrigger value="services">Servizi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Entrate Mensili</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`€${value}`, 'Entrate']} />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Servizi Più Richiesti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={servicesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {servicesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Appuntamenti Completati</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedAppointments.length > 0 ? (
                completedAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nessun appuntamento completato</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Statistics;