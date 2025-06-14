import { useCallback, useEffect, useMemo, useState } from "react";
import { CartContext } from "./CartContext";
import { getCartIDs, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, type AddToCartParams, type RemoveFromCartParams } from "@/api";

type CartProviderProps = React.PropsWithChildren;

export const CartProvider: React.FC<CartProviderProps> = ({children}) => {
    const [cart, setCart] = useState<number[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true)
            try {
                const cartIDs = await getCartIDs();
                setCart(cartIDs)
                setError("")
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                setCart([])
                setError(errorMessage)
            }
            setLoading(false)
        }
        fetchCart();
    }, [])

    const addToCart = async (addToCartParams: AddToCartParams) => {
        try {
            await apiAddToCart(addToCartParams)
            setCart(currentCart => [...currentCart, addToCartParams.productId])
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage)
        }
    }

    const removeFromCart = useCallback(async (removeFromCartParams: RemoveFromCartParams) => {
        const idx = cart.indexOf(removeFromCartParams.productId);
        if (idx === -1) {
            return;
        }

        try {
            await apiRemoveFromCart(removeFromCartParams)
            setCart(cart.toSpliced(idx, 1))
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage)
        }
    }, [cart])

    const value = useMemo(() => ({ cart, loading, error, addToCart, removeFromCart }), [cart, loading, error, removeFromCart])
    return <CartContext value={value}>{children}</CartContext>
}
