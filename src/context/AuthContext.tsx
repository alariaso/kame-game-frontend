
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardPack, UserInventory, UserCard } from "@/types";
import { MOCK_CARDS, MOCK_CARD_PACKS, MOCK_USER_INVENTORY } from "@/data/mockData";

// Define los tipos de usuario
type Role = "user" | "admin";

export interface User {
  id: string;
  username: string;
  role: Role;
  balance: number; // Saldo en Yugi Pesos
}

// Mock de usuarios para pruebas
const MOCK_USERS = [
  { id: "1", username: "admin", password: "admin123", role: "admin" as Role, balance: 10000 },
  { id: "2", username: "user", password: "user123", role: "user" as Role, balance: 5000 }
];

// Copia local de las cartas y paquetes para manipular el stock
let availableCards = [...MOCK_CARDS];
let availablePacks = [...MOCK_CARD_PACKS];

interface AuthContextType {
  user: User | null;
  userInventory: UserInventory;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  depositBalance: (amount: number) => void;
  buyCard: (cardId: string) => boolean;
  buyPack: (packId: string) => boolean;
  getAvailableCards: () => Card[];
  getAvailablePacks: () => CardPack[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userInventory, setUserInventory] = useState<UserInventory>(MOCK_USER_INVENTORY);
  
  // Intenta restaurar la sesión desde localStorage al cargar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Validación de nombre de usuario: solo letras, 3-30 caracteres
  const validateUsername = (username: string): boolean => {
    return /^[a-zA-Z]{3,30}$/.test(username);
  };

  // Validación de contraseña: cualquier símbolo UTF-8, 6-50 caracteres
  const validatePassword = (password: string): boolean => {
    return password.length >= 6 && password.length <= 50;
  };

  // Función para obtener cartas disponibles (con stock > 0)
  const getAvailableCards = (): Card[] => {
    return availableCards.filter(card => card.stock > 0);
  };

  // Función para obtener paquetes disponibles (con stock > 0)
  const getAvailablePacks = (): CardPack[] => {
    return availablePacks.filter(pack => pack.stock > 0);
  };

  // Función para depositar saldo
  const depositBalance = (amount: number) => {
    if (!user) return;
    
    if (amount <= 0) {
      toast.error("El monto debe ser mayor a 0");
      return;
    }
    
    const updatedUser = { ...user, balance: user.balance + amount };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    toast.success(`Has depositado ${amount} Yugi Pesos`);
  };

  // Función para comprar una carta
  const buyCard = (cardId: string): boolean => {
    if (!user) {
      toast.error("Debes iniciar sesión para comprar");
      return false;
    }

    const cardIndex = availableCards.findIndex(card => card.id === cardId);
    if (cardIndex === -1 || availableCards[cardIndex].stock <= 0) {
      toast.error("Esta carta no está disponible");
      return false;
    }

    const card = availableCards[cardIndex];
    
    if (user.balance < card.price) {
      toast.error("No tienes suficiente saldo para comprar esta carta");
      return false;
    }

    // Actualizar saldo
    const updatedUser = { ...user, balance: user.balance - card.price };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Actualizar stock
    const updatedCards = [...availableCards];
    updatedCards[cardIndex] = { ...card, stock: card.stock - 1 };
    availableCards = updatedCards;

    // Actualizar inventario
    const existingCardInInventory = userInventory.cards.find(item => item.cardId === cardId);
    let updatedInventory: UserInventory;

    if (existingCardInInventory) {
      // Si ya tiene la carta, aumentar cantidad
      const updatedUserCards = userInventory.cards.map(item => 
        item.cardId === cardId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
      updatedInventory = { ...userInventory, cards: updatedUserCards };
    } else {
      // Si no tiene la carta, agregarla al inventario
      const newUserCard: UserCard = {
        id: `inv-${Date.now()}`,
        cardId: card.id,
        quantity: 1,
        card: card
      };
      updatedInventory = { 
        ...userInventory, 
        cards: [...userInventory.cards, newUserCard] 
      };
    }

    setUserInventory(updatedInventory);
    toast.success(`Has comprado la carta ${card.name}`);
    return true;
  };

  // Función para comprar un paquete
  const buyPack = (packId: string): boolean => {
    if (!user) {
      toast.error("Debes iniciar sesión para comprar");
      return false;
    }

    const packIndex = availablePacks.findIndex(pack => pack.id === packId);
    if (packIndex === -1 || availablePacks[packIndex].stock <= 0) {
      toast.error("Este paquete no está disponible");
      return false;
    }

    const pack = availablePacks[packIndex];
    
    if (user.balance < pack.price) {
      toast.error("No tienes suficiente saldo para comprar este paquete");
      return false;
    }

    // Actualizar saldo
    const updatedUser = { ...user, balance: user.balance - pack.price };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Actualizar stock
    const updatedPacks = [...availablePacks];
    updatedPacks[packIndex] = { ...pack, stock: pack.stock - 1 };
    availablePacks = updatedPacks;

    // Simular las cartas obtenidas del paquete (lógica simplificada)
    const randomCards = getRandomCards(pack.cardCount);
    let updatedInventory = { ...userInventory };

    randomCards.forEach(card => {
      const existingCardInInventory = updatedInventory.cards.find(item => item.cardId === card.id);
      
      if (existingCardInInventory) {
        // Si ya tiene la carta, aumentar cantidad
        updatedInventory.cards = updatedInventory.cards.map(item => 
          item.cardId === card.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Si no tiene la carta, agregarla al inventario
        const newUserCard: UserCard = {
          id: `inv-${Date.now()}-${card.id}`,
          cardId: card.id,
          quantity: 1,
          card: card
        };
        updatedInventory.cards = [...updatedInventory.cards, newUserCard];
      }
    });

    setUserInventory(updatedInventory);
    toast.success(`Has comprado el paquete ${pack.name}`);
    return true;
  };

  // Función auxiliar para obtener cartas aleatorias
  const getRandomCards = (count: number): Card[] => {
    const availableForPacks = [...MOCK_CARDS]; // Usar todas las cartas para los paquetes
    const randomCards: Card[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * availableForPacks.length);
      randomCards.push(availableForPacks[randomIndex]);
    }
    
    return randomCards;
  };

  // Función de login
  const login = async (username: string, password: string): Promise<boolean> => {
    // Validaciones
    if (!validateUsername(username)) {
      toast.error("El nombre de usuario debe contener solo letras y tener entre 3 y 30 caracteres");
      return false;
    }
    
    if (!validatePassword(password)) {
      toast.error("La contraseña debe tener entre 6 y 50 caracteres");
      return false;
    }

    // Mock de autenticación
    const foundUser = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      toast.success(`¡Bienvenido, ${username}!`);
      return true;
    } else {
      toast.error("Credenciales incorrectas");
      return false;
    }
  };

  // Función de registro
  const register = async (username: string, password: string): Promise<boolean> => {
    // Validaciones
    if (!validateUsername(username)) {
      toast.error("El nombre de usuario debe contener solo letras y tener entre 3 y 30 caracteres");
      return false;
    }
    
    if (!validatePassword(password)) {
      toast.error("La contraseña debe tener entre 6 y 50 caracteres");
      return false;
    }

    // Verificar si el usuario ya existe
    if (MOCK_USERS.some((u) => u.username === username)) {
      toast.error("Este nombre de usuario ya existe");
      return false;
    }

    // En un entorno real, aquí se enviaría una petición al servidor
    // Para este demo, simulamos que el registro fue exitoso
    const newUser = {
      id: `${MOCK_USERS.length + 1}`,
      username,
      password,
      role: "user" as Role,
      balance: 1000 // Saldo inicial para nuevos usuarios
    };
    
    MOCK_USERS.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    
    toast.success("¡Registro exitoso!");
    return true;
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Sesión cerrada");
  };

  // Verificar si el usuario es administrador
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        userInventory,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isAdmin,
        depositBalance,
        buyCard,
        buyPack,
        getAvailableCards,
        getAvailablePacks
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

