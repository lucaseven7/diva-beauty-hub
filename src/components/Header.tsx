
import { Bell } from "lucide-react";
import { useLocation } from "react-router-dom";

interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  const location = useLocation();
  const path = location.pathname;
  
  // Determine the title based on the current path if not provided
  const getTitle = () => {
    if (title) return title;
    
    switch (path) {
      case '/':
        return 'Dashboard';
      case '/appointments':
        return 'Appuntamenti';
      case '/clients':
        return 'Clienti';
      case '/gallery':
        return 'Galleria';
      case '/stats':
        return 'Statistiche';
      default:
        return 'Diva Beauty Hub';
    }
  };

  return (
    <div className="sticky top-0 bg-white z-40 border-b border-gray-100">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <h1 className="text-xl font-playfair font-semibold">{getTitle()}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
