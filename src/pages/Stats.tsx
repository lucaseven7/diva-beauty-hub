
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { StatsCard } from "@/components/StatsCard";
import { Calendar, Euro, Users, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { getAppointments, getClients } from "@/services/localStorage";
import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths } from "date-fns";
import { it } from "date-fns/locale";

const COLORS = ["#9b87f5", "#D6BCFA", "#FFDEE2", "#FDE1D3", "#F1F0FB"];

const Stats = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [currentMonthStats, setCurrentMonthStats] = useState({
    revenue: 0,
    appointments: 0,
    newClients: 0,
    averageServicePrice: 0
  });
  const [previousMonthStats, setPreviousMonthStats] = useState({
    revenue: 0,
    appointments: 0,
    newClients: 0,
    averageServicePrice: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    // Ottieni tutti gli appuntamenti e clienti
    const allAppointments = getAppointments();
    const allClients = getClients();
    
    // Date per il mese corrente
    const today = new Date();
    const firstDayOfCurrentMonth = startOfMonth(today);
    const lastDayOfCurrentMonth = endOfMonth(today);
    
    // Date per il mese precedente
    const firstDayOfPreviousMonth = startOfMonth(subMonths(today, 1));
    const lastDayOfPreviousMonth = endOfMonth(subMonths(today, 1));
    
    // Filtra gli appuntamenti del mese corrente
    const currentMonthAppointments = allAppointments.filter(appt => {
      if (!appt.date) return false;
      const apptDate = new Date(appt.date);
      return isWithinInterval(apptDate, { 
        start: firstDayOfCurrentMonth, 
        end: lastDayOfCurrentMonth 
      });
    });
    
    // Filtra gli appuntamenti del mese precedente
    const previousMonthAppointments = allAppointments.filter(appt => {
      if (!appt.date) return false;
      const apptDate = new Date(appt.date);
      return isWithinInterval(apptDate, { 
        start: firstDayOfPreviousMonth, 
        end: lastDayOfPreviousMonth 
      });
    });
    
    // Calcola le statistiche del mese corrente
    const currentRevenue = currentMonthAppointments
      .filter(appt => appt.status === "completed")
      .reduce((sum, appt) => sum + (appt.price || 0), 0);
    const currentAppointmentsCount = currentMonthAppointments.length;
    const currentAveragePrice = currentAppointmentsCount > 0 
      ? Math.round(currentRevenue / currentAppointmentsCount) 
      : 0;
    
    // Calcola le statistiche del mese precedente
    const previousRevenue = previousMonthAppointments
      .filter(appt => appt.status === "completed")
      .reduce((sum, appt) => sum + (appt.price || 0), 0);
    const previousAppointmentsCount = previousMonthAppointments.length;
    const previousAveragePrice = previousAppointmentsCount > 0 
      ? Math.round(previousRevenue / previousAppointmentsCount) 
      : 0;
    
    // Ottieni i clienti unici di questo mese
    const currentMonthClientIds = [...new Set(currentMonthAppointments.map(appt => appt.clientId))];
    const previousMonthClientIds = [...new Set(previousMonthAppointments.map(appt => appt.clientId))];
    
    setCurrentMonthStats({
      revenue: currentRevenue,
      appointments: currentAppointmentsCount,
      newClients: currentMonthClientIds.length,
      averageServicePrice: currentAveragePrice
    });
    
    setPreviousMonthStats({
      revenue: previousRevenue,
      appointments: previousAppointmentsCount,
      newClients: previousMonthClientIds.length,
      averageServicePrice: previousAveragePrice
    });
    
    // Prepara i dati per il grafico delle entrate mensili
    const monthlyRevenue = {};
    
    // Inizializza gli ultimi 4 mesi
    for (let i = 3; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = format(month, 'MMM', { locale: it });
      monthlyRevenue[monthName] = 0;
    }
    
    // Calcola le entrate per ogni mese
    allAppointments.forEach(appt => {
      if (!appt.date || appt.status !== "completed") return;
      
      const apptDate = new Date(appt.date);
      const monthName = format(apptDate, 'MMM', { locale: it });
      
      if (monthlyRevenue[monthName] !== undefined) {
        monthlyRevenue[monthName] += (appt.price || 0);
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
    allAppointments.forEach(appt => {
      if (!appt.service) return;
      
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
  }, [selectedPeriod]);

  // Calcola le percentuali di crescita
  const revenueGrowth = previousMonthStats.revenue !== 0 
    ? ((currentMonthStats.revenue - previousMonthStats.revenue) /
       previousMonthStats.revenue) * 100
    : 0;
  
  const appointmentsGrowth = previousMonthStats.appointments !== 0
    ? ((currentMonthStats.appointments -
       previousMonthStats.appointments) /
       previousMonthStats.appointments) * 100
    : 0;
  
  const clientsGrowth = previousMonthStats.newClients !== 0
    ? ((currentMonthStats.newClients -
       previousMonthStats.newClients) /
       previousMonthStats.newClients) * 100
    : 0;
    
  const priceGrowth = previousMonthStats.averageServicePrice !== 0
    ? ((currentMonthStats.averageServicePrice -
       previousMonthStats.averageServicePrice) /
       previousMonthStats.averageServicePrice) * 100
    : 0;

  return (
    <Layout title="Statistiche">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold font-playfair">
            Riepilogo attività
          </h2>
          <Select defaultValue={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Settimana</SelectItem>
              <SelectItem value="month">Mese</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Anno</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatsCard
            title="Entrate"
            value={`${currentMonthStats.revenue}€`}
            icon={<Euro className="h-4 w-4 text-beauty-purple" />}
            trend={{
              value: Math.round(revenueGrowth),
              isPositive: revenueGrowth > 0,
            }}
          />
          <StatsCard
            title="Appuntamenti"
            value={currentMonthStats.appointments}
            icon={<Calendar className="h-4 w-4 text-beauty-purple" />}
            trend={{
              value: Math.round(appointmentsGrowth),
              isPositive: appointmentsGrowth > 0,
            }}
          />
          <StatsCard
            title="Nuovi clienti"
            value={currentMonthStats.newClients}
            icon={<Users className="h-4 w-4 text-beauty-purple" />}
            trend={{
              value: Math.round(clientsGrowth),
              isPositive: clientsGrowth > 0,
            }}
          />
          <StatsCard
            title="Prezzo medio"
            value={`${currentMonthStats.averageServicePrice}€`}
            icon={<TrendingUp className="h-4 w-4 text-beauty-purple" />}
            trend={{
              value: Math.round(priceGrowth),
              isPositive: priceGrowth > 0,
            }}
          />
        </div>

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

        <Card className="p-4">
          <h3 className="font-medium mb-4">Distribuzione dei servizi</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={servicesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {servicesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, "Percentuale"]} 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Stats;
