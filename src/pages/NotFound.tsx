
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-mystic to-background p-6">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold mb-6 text-gold">404</h1>
        <p className="text-xl text-gray-300 mb-6">La carta que buscas no existe en este reino</p>
        <div className="border-t border-gold/20 pt-6 mb-6"></div>
        <Button asChild className="bg-gold hover:bg-gold-dark text-black font-semibold">
          <Link to="/">Volver al Inicio</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
