import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext, useContext } from "react";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart"; 
import Inventory from "./pages/Inventory";
import Battles from "./pages/Battles";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Components and Context
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { useCart } from "./hooks/useCart";

export const CartContext = createContext<ReturnType<typeof useCart> | null>(null);

const queryClient = new QueryClient();

// Create an AppContent component that uses the cart hook after AuthProvider is available
const AppContent = () => {
  const cartUtils = useCart();
  
  // Make addToCart available globally
  if (typeof window !== "undefined") {
    (window as any).addToCart = cartUtils.addToCart;
  }

  return (
    <CartContext.Provider value={cartUtils}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} /> {/* Añadimos la ruta del carrito */}
              <Route path="/inventory" element={
                <ProtectedRoute>
                  <Inventory />
                </ProtectedRoute>
              } />
              <Route path="/battles" element={
                <ProtectedRoute>
                  <Battles />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </TooltipProvider>
    </CartContext.Provider>
  );
};

// Main App component with proper provider nesting
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;