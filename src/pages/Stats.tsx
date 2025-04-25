
import { useState } from "react";
import Layout from "@/components/Layout";
import { StatsCard } from "@/components/StatsCard";
import { Calendar, Euro, Users, TrendingUp } from "lucide-react";
import { mockMonthlyStats, mockAppointments } from "@/data/mockData";
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

const COLORS = ["#9b87f5", "#D6BCFA", "#FFDEE2", "#FDE1D3", "#F1F0FB"];

const Stats = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const revenueGrowth =
    ((mockMonthlyStats.currentMonth.revenue - mockMonthlyStats.previousMonth.revenue) /
      mockMonthlyStats.previousMonth.revenue) *
    100;

  const appointmentsGrowth =
    ((mockMonthlyStats.currentMonth.appointments -
      mockMonthlyStats.previousMonth.appointments) /
      mockMonthlyStats.previousMonth.appointments) *
    100;

  const clientsGrowth =
    ((mockMonthlyStats.currentMonth.newClients -
      mockMonthlyStats.previousMonth.newClients) /
      mockMonthlyStats.previousMonth.newClients) *
    100;

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
            value={`${mockMonthlyStats.currentMonth.revenue}€`}
            icon={<Euro className="h-4 w-4 text-beauty-purple" />}
            trend={{
              value: Math.round(revenueGrowth),
              isPositive: revenueGrowth > 0,
            }}
          />
          <StatsCard
            title="Appuntamenti"
            value={mockMonthlyStats.currentMonth.appointments}
            icon={<Calendar className="h-4 w-4 text-beauty-purple" />}
            trend={{
              value: Math.round(appointmentsGrowth),
              isPositive: appointmentsGrowth > 0,
            }}
          />
          <StatsCard
            title="Nuovi clienti"
            value={mockMonthlyStats.currentMonth.newClients}
            icon={<Users className="h-4 w-4 text-beauty-purple" />}
            trend={{
              value: Math.round(clientsGrowth),
              isPositive: clientsGrowth > 0,
            }}
          />
          <StatsCard
            title="Prezzo medio"
            value={`${mockMonthlyStats.currentMonth.averageServicePrice}€`}
            icon={<TrendingUp className="h-4 w-4 text-beauty-purple" />}
            trend={{
              value: Math.round(
                ((mockMonthlyStats.currentMonth.averageServicePrice -
                  mockMonthlyStats.previousMonth.averageServicePrice) /
                  mockMonthlyStats.previousMonth.averageServicePrice) *
                  100
              ),
              isPositive:
                mockMonthlyStats.currentMonth.averageServicePrice >
                mockMonthlyStats.previousMonth.averageServicePrice,
            }}
          />
        </div>

        <Card className="p-4">
          <h3 className="font-medium mb-4">Entrate mensili</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockMonthlyStats.revenueData}
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
                  data={mockMonthlyStats.servicesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {mockMonthlyStats.servicesData.map((entry, index) => (
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
