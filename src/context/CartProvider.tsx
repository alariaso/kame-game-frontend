import { useEffect, useMemo, useState } from "react";
import { CartContext } from "./CartContext";
import { getCartIDs, addToCart as apiAddToCart, type AddToCartParams } from "@/api";

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

    const value = useMemo(() => ({ cart, loading, error, addToCart }), [cart, loading, error])
    return <CartContext value={value}>{children}</CartContext>
}
