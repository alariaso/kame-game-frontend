import { createContext, use } from "react";
import type { AddToCartParams } from "@/api";

type CartContextType = {
    cart: number[];
    loading: boolean;
    error: string;
    addToCart: (addToCartParams: AddToCartParams) => Promise<void>;
};

export const CartContext = createContext<CartContextType>(null!);

export const useCart = () => {
    const cartContext = use(CartContext);

    return cartContext;
}
