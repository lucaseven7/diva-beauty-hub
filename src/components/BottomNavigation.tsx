import { useEffect } from "react";
import { Home, Calendar, Users, Image, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();
  const path = location.pathname;

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

  const handleScroll = () => {
    if (!nav) return;

    if (window.scrollY > lastScrollY) {
      nav.style.transform = "translateY(100%)"; // Nascondi
    } else {
      nav.style.transform = "translateY(0)"; // Mostra
    }

    lastScrollY = window.scrollY;
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
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
