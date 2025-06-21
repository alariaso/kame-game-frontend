
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { User, UserPlus } from "lucide-react";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await register(username, password);
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
            <UserPlus className="text-gold" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gold">Crear Cuenta</h1>
          <p className="text-gray-400 mt-2">Únete al mercado de cartas más exclusivo</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Nombre de Usuario</Label>
            <Input
              id="username"
              type="text"
              placeholder="Elige un nombre de usuario"
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
              placeholder="Crea una contraseña"
              className="bg-black/40 border-gold/20 focus:border-gold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">Entre 6 y 50 caracteres</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              className="bg-black/40 border-gold/20 focus:border-gold"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
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
                <UserPlus className="mr-2" size={18} />
                Crear Cuenta
              </span>
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="text-gold hover:underline">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
