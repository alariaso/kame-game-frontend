import { createContext, use } from "react";
import type { AddToCartParams, RemoveFromCartParams } from "@/api";

type CartContextType = {
    cart: number[];
    loading: boolean;
    error: string;
    addToCart: (addToCartParams: AddToCartParams) => Promise<void>;
    removeFromCart: (removeFromCartParams: RemoveFromCartParams) => Promise<void>;
};

export const CartContext = createContext<CartContextType>(null!);

export const useCart = () => {
    const cartContext = use(CartContext);

    return cartContext;
}
