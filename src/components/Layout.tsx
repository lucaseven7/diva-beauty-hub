
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-beauty-gray">
      <Header title={title} />
      <main className="flex-1 container mx-auto px-4 pb-20 pt-4 max-w-lg">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;
