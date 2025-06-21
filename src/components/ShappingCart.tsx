
import React from "react";
import { ShoppingCart as CartIcon, Plus, Minus, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Card as CardType, CardPack } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  type: 'card' | 'pack';
  itemRef: CardType | CardPack;
};

type ShoppingCartProps = {
  items: CartItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
  updateItemQuantity: (id: string, change: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  checkout: () => void;
};

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items,
  open,
  setOpen,
  updateItemQuantity,
  removeItem,
  clearCart,
  checkout
}) => {
  const { isAuthenticated } = useAuth();
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para completar la compra");
      return;
    }
    
    checkout();
  };

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="icon"
        className="relative bg-black/40 border-gold/30 hover:bg-gold/10"
        onClick={() => setOpen(!open)}
      >
        <CartIcon className="h-5 w-5 text-gold" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-gold text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {totalItems}
          </span>
        )}
      </Button>

      {open && (
        <Card className="absolute top-10 right-0 w-80 sm:w-96 z-50 bg-black/90 backdrop-blur-md border-gold/20 shadow-lg shadow-gold/10">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-gold flex items-center gap-2">
              <CartIcon className="h-5 w-5" />
              Carrito de compras
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-gray-400 hover:text-white"
              onClick={() => setOpen(false)}
            >
              ✕
            </Button>
          </CardHeader>
          
          <CardContent className="max-h-[60vh] overflow-y-auto py-2">
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Tu carrito está vacío
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 border-b border-gold/10 pb-3">
                    <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gold truncate">{item.name}</h4>
                      <p className="text-xs text-gray-400">{item.type === 'card' ? 'Carta' : 'Paquete'}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-medium">${item.price}</span>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6 p-0 border-gold/20" 
                            onClick={() => updateItemQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6 p-0 border-gold/20" 
                            onClick={() => updateItemQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10" 
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          {items.length > 0 && (
            <CardFooter className="flex-col gap-2">
              <div className="w-full flex justify-between items-center border-t border-gold/20 pt-3">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-gold">${totalPrice}</span>
              </div>
              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex-1 border-gold/20 hover:bg-red-500/10 hover:text-red-400"
                  onClick={clearCart}
                >
                  Vaciar
                </Button>
                <Button 
                  size="sm"
                  className="flex-1 bg-gold hover:bg-gold/80 text-black font-medium"
                  onClick={handleCheckout}
                >
                  Comprar
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
};

export default ShoppingCart;
