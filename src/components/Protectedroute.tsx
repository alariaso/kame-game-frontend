
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere admin y el usuario no es admin, redirigir a home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si todo está correcto, mostrar el contenido de la ruta
  return <>{children}</>;
};

export default ProtectedRoute;
