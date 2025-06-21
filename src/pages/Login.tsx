
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { User, LogIn } from "lucide-react";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center bg-gradient-to-b from-mystic/40 to-background p-6">
      <div className="max-w-md w-full bg-black/50 backdrop-blur-md rounded-lg border border-gold/10 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-gold" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gold">Iniciar Sesión</h1>
          <p className="text-gray-400 mt-2">Accede a tu cuenta para comprar cartas y participar en duelos</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Nombre de Usuario</Label>
            <Input
              id="username"
              type="text"
              placeholder="Ingresa tu nombre de usuario"
              className="bg-black/40 border-gold/20 focus:border-gold"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">Solo letras, entre 3 y 30 caracteres</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              className="bg-black/40 border-gold/20 focus:border-gold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">Entre 6 y 50 caracteres</p>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gold hover:bg-gold-dark text-black font-semibold"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⟳</span> Procesando...
              </span>
            ) : (
              <span className="flex items-center">
                <LogIn className="mr-2" size={18} />
                Iniciar Sesión
              </span>
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-gold hover:underline">
              Registrarse
            </Link>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gold/10 text-gray-500 text-sm text-center">
          <p>Para fines de prueba:</p>
          <p>Usuario: admin | Contraseña: admin123</p>
          <p>Usuario: user | Contraseña: user123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
