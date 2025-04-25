
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { StatsCard } from "@/components/StatsCard";
import { AppointmentCard } from "@/components/AppointmentCard";
import { Button } from "@/components/ui/button";
import { Calendar, Euro, Users } from "lucide-react";
import { mockAppointments, mockMonthlyStats } from "@/data/mockData";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";

const Index = () => {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const today = new Date();
  const formattedDate = format(today, "EEEE, d MMMM", { locale: it });

  useEffect(() => {
    // Filter appointments for today
    const todaysAppts = mockAppointments.filter(
      (appt) => appt.date === format(today, "yyyy-MM-dd") && appt.status === "scheduled"
    );
    setTodayAppointments(todaysAppts);
  }, []);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-semibold font-playfair">
            Buongiorno, Beautician!
          </h2>
          <p className="text-muted-foreground mt-1 capitalize">{formattedDate}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            title="Appuntamenti del mese"
            value={mockMonthlyStats.currentMonth.appointments}
            icon={<Calendar className="h-4 w-4 text-beauty-purple" />}
            trend={{ value: 13, isPositive: true }}
          />
          <StatsCard
            title="Entrate del mese"
            value={`${mockMonthlyStats.currentMonth.revenue}€`}
            icon={<Euro className="h-4 w-4 text-beauty-purple" />}
            trend={{ value: 18, isPositive: true }}
          />
        </div>

        <div className="beauty-card space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Entrate mensili</h3>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMonthlyStats.revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Bar dataKey="value" fill="#9b87f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

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
        
        <Link to="/appointments/new" className="fixed bottom-20 right-4 z-40">
          <Button size="lg" className="rounded-full h-14 w-14 bg-beauty-purple hover:bg-beauty-purple/90 shadow-lg">
            <span className="text-xl font-bold">+</span>
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default Index;
