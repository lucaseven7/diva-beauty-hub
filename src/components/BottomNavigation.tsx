import { useEffect } from "react";
import { Home, Calendar, Users, Image, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();
  const path = location.pathname;
  const isNewAppointmentPage = path === "/appointments/new";
  
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Appuntamenti", path: "/appointments", icon: Calendar },
    { name: "Clienti", path: "/clients", icon: Users },
    { name: "Galleria", path: "/gallery", icon: Image },
    { name: "Statistiche", path: "/stats", icon: BarChart3 },
  ];

  useEffect(() => {
    const nav = document.getElementById("bottom-nav");
    let lastScrollY = window.scrollY;
    
    // Gestione dello scroll più fluida con debounce
    let scrollTimer = null;
    
    const handleScroll = () => {
      if (!nav || isNewAppointmentPage) return;
      
      // Cancella il timer precedente
      if (scrollTimer) clearTimeout(scrollTimer);
      
      // Imposta un nuovo timer
      scrollTimer = setTimeout(() => {
        // Nascondi la barra solo se lo scroll verso il basso è significativo (>20px)
        if (window.scrollY > lastScrollY + 20) {
          nav.style.transform = "translateY(100%)"; // scroll down → hide
        } else if (window.scrollY < lastScrollY - 5) {
          nav.style.transform = "translateY(0)"; // scroll up → show
        }
        
        lastScrollY = window.scrollY;
      }, 100); // Debounce di 100ms
    };
    
    // Gestione della visibilità della barra
    if (nav) {
      if (isNewAppointmentPage) {
        // Nascondi completamente la barra nella pagina di nuovo appuntamento
        nav.style.display = "none";
      } else {
        // Mostra la barra in tutte le altre pagine
        nav.style.display = "block";
        nav.style.transform = "translateY(0)";
      }
    }
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [path, isNewAppointmentPage]);
  
  // Non renderizzare il componente se siamo nella pagina di nuovo appuntamento
  if (isNewAppointmentPage) {
    return null;
  }
  
  return (
    <div
      id="bottom-nav"
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50 transition-transform duration-300"
    >
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = path === item.path;
          return (
            <Link
              to={item.path}
              key={item.path}
              className={`flex flex-col items-center justify-center py-2 px-3 ${
                isActive ? "text-beauty-purple" : "text-gray-500"
              }`}
            >
              <item.icon
                className={`h-6 w-6 ${isActive ? "text-beauty-purple" : "text-gray-400"}`}
              />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;