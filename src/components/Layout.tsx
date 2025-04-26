
import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { getUpcomingAppointmentsForNotification } from '@/services/localStorage';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout = ({ children, title }) => {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    // Controlla gli appuntamenti imminenti ogni minuto
    const checkNotifications = () => {
      const upcomingAppointments = getUpcomingAppointmentsForNotification(3); // 3 ore
      setNotifications(upcomingAppointments);
    };
    
    // Controlla subito all'avvio
    checkNotifications();
    
    // Imposta un intervallo per controllare periodicamente
    const intervalId = setInterval(checkNotifications, 60000); // ogni minuto
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <img 
                src="/nails-logo.png" 
                alt="Nails by Bae Logo" 
                className="h-20 w-18 mr-3 object-contain rounded-full shadow-sm" 
              />
            <h1 className="text-xl font-playfair font-semibold">{title}</h1>
          </div>
          
          <div className="flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-gray-100">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="font-medium">Notifiche</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(appt => (
                      <Link 
                        key={appt.id} 
                        to={`/appointments/${appt.id}`}
                        className="block p-3 border-b border-gray-100 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{appt.clientName}</p>
                            <p className="text-sm text-muted-foreground">{appt.service}</p>
                            <p className="text-xs text-muted-foreground">
                              Oggi alle {appt.time}
                            </p>
                          </div>
                          <div className="text-beauty-purple font-medium">
                            €{appt.price}
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      Nessuna notifica
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;
