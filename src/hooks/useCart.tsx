
import { useState, useEffect } from "react"
import { Card as CardType, CardPack } from "@/types"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import { 
  clearCart as clearCartAPI, 
  removeCartItem as removeCartItemAPI,
  addToCart as addToCartAPI,
  getCart as getCartAPI
} from "@/services/api"

export type CartItem = {
	id: string
	name: string
	price: number
	quantity: number
	imageUrl: string
	type: "card" | "pack"
	itemRef: CardType | CardPack
}

export const useCart = () => {
	const [cartItems, setCartItems] = useState<CartItem[]>([])
	const [cartOpen, setCartOpen] = useState(false)
	const { isAuthenticated, buyCard, buyPack } = useAuth()

	// Cargar carrito desde la API al inicializar
	useEffect(() => {
		if (isAuthenticated) {
			loadCartFromAPI()
		}
	}, [isAuthenticated])

	const loadCartFromAPI = async () => {
		if (!isAuthenticated) return

		try {
			const response = await getCartAPI()
			
			if (response.error) {
				console.error("Error loading cart:", response.message)
				return
			}

			const apiCartItems = response.data?.items || []
			const formattedItems: CartItem[] = apiCartItems.map((item: any) => ({
				id: item.cardId?.toString() || item.id?.toString(),
				name: item.card?.name || item.name || "Carta desconocida",
				price: item.card?.price || item.price || 0,
				quantity: item.quantity || 1,
				imageUrl: item.card?.imageUrl || item.imageUrl || "",
				type: "card", 
				itemRef: item.card || item
			}))
			
			setCartItems(formattedItems)
		} catch (error) {
			console.error("Error loading cart from API:", error)
		}
	}

	const addToCart = async (
		item: CardType | CardPack,
		itemType: "card" | "pack"
	) => {
		if (!isAuthenticated) {
			toast.error("Debes iniciar sesión para agregar al carrito")
			return
		}

		try {
			// Usar la API real para agregar al carrito
			const response = await addToCartAPI(Number(item.id))
			
			if (response.error) {
				toast.error("Error al agregar al carrito: " + response.message)
				return
			}

			// Actualizar el estado local
			setCartItems((prevItems) => {
				const existingItemIndex = prevItems.findIndex(
					(cartItem) => cartItem.id === item.id && cartItem.type === itemType
				)

				if (existingItemIndex >= 0) {
					const updatedItems = [...prevItems]
					updatedItems[existingItemIndex].quantity += 1
					return updatedItems
				} else {
					const newItem: CartItem = {
						id: item.id,
						name: item.name,
						price: item.price,
						quantity: 1,
						imageUrl: item.imageUrl,
						type: itemType,
						itemRef: item,
					}
					return [...prevItems, newItem]
				}
			})

			toast.success(
				`${itemType === "card" ? "Carta" : "Paquete"} agregado al carrito`
			)
			setCartOpen(true)
		} catch (error) {
			console.error("Error adding to cart:", error)
			toast.error("Error al agregar al carrito")
		}
	}

	const updateCartItemQuantity = (id: string, change: number) => {
		setCartItems((prevItems) =>
			prevItems.map((item) =>
				item.id === id
					? { ...item, quantity: Math.max(1, item.quantity + change) }
					: item
			)
		)
	}

	const removeCartItem = async (id: string) => {
		if (!isAuthenticated) {
			toast.error("Debes iniciar sesión")
			return
		}

		try {
			const response = await removeCartItemAPI(Number(id))
			
			if (response.error) {
				toast.error("Error al eliminar el ítem del carrito")
				return
			}

			setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
			toast.success("Ítem eliminado del carrito")
		} catch (error) {
			console.error("Error removing cart item:", error)
			toast.error("Error al eliminar el ítem del carrito")
		}
	}

	const clearCart = async () => {
		if (!isAuthenticated) {
			toast.error("Debes iniciar sesión")
			return
		}

		try {
			const response = await clearCartAPI()
			
			if (response.error) {
				toast.error("Error al vaciar el carrito")
				return
			}

			setCartItems([])
			toast.success("Carrito vaciado correctamente")
		} catch (error) {
			console.error("Error clearing cart:", error)
			toast.error("Error al vaciar el carrito")
		}
	}

	const handleCheckout = () => {
		if (!isAuthenticated) {
			toast.error("Debes iniciar sesión para comprar")
			return
		}

		let allPurchasesSuccessful = true

		// Procesar cada ítem en el carrito
		for (const item of cartItems) {
			const { id, quantity, type } = item

			for (let i = 0; i < quantity; i++) {
				const success = type === "card" ? buyCard(id) : buyPack(id)

				if (!success) {
					allPurchasesSuccessful = false
					break
				}
			}

			if (!allPurchasesSuccessful) break
		}

		if (allPurchasesSuccessful) {
			toast.success("Compra realizada con éxito")
			clearCart()
			setCartOpen(false)
		} else {
			toast.error(
				"Error al procesar la compra. Verifica tu saldo o el stock disponible."
			)
		}
	}

	return {
		cartItems,
		cartOpen,
		setCartOpen,
		addToCart,
		updateCartItemQuantity,
		removeCartItem,
		clearCart,
		checkout: handleCheckout,
		refreshCart: loadCartFromAPI
	}
}
