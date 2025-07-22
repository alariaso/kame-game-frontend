
import { useState, useEffect } from "react"
import { Card as CardType, CardPack } from "@/types"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import {
	clearCart as clearCartAPI,
	removeCartItem as removeCartItemAPI,
	addToCart as addToCartAPI,
	getCart as getCartAPI,
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

	// Cargar carrito desde la API real al inicializar
	useEffect(() => {
		if (isAuthenticated) {
			loadCartFromAPI()
		}
	}, [isAuthenticated])

	const loadCartFromAPI = async () => {
		if (!isAuthenticated) return

		try {
			console.log("Loading cart from API...")
			const response = await getCartAPI()

			if (response.error) {
				console.error("Error loading cart:", response.message)
				toast.error("Error al cargar el carrito: " + response.message)
				setCartItems([])
				return
			}

			// Procesar los datos reales del carrito desde la API
			const apiCartItems = [
				...(response.data?.cards || []),
				...(response.data?.packs || []),
			]

			const formattedItems: CartItem[] = apiCartItems.map((item: any) => {
				// Asegurar que el precio sea siempre un número válido
				const price = Number(item.card?.price || item.price || 0)
				const quantity = Number(item.quantity || 1)
				
				return {
					id: item.cardId?.toString() || item.id?.toString(),
					name: item.card?.name || item.name || "Producto desconocido",
					price: isNaN(price) ? 0 : price,
					quantity: isNaN(quantity) ? 1 : quantity,
					imageUrl: item.card?.imageUrl || item.imageUrl || "",
					type: item.card ? "card" : "pack",
					itemRef: item.card || item,
				}
			})

			console.log("Cart loaded successfully:", formattedItems)
			setCartItems(formattedItems)
		} catch (error) {
			console.error("Error loading cart from API:", error)
			toast.error("Error de conexión al cargar el carrito")
			setCartItems([])
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
			console.log("Adding to cart:", item.id, itemType)
			const response = await addToCartAPI(Number(item.id))

			if (response.error) {
				toast.error("Error al agregar al carrito: " + response.message)
				return
			}

			// Recargar el carrito desde la API para obtener el estado actualizado
			await loadCartFromAPI()

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
		// Actualización temporal local, luego sincronizar con API
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
			console.log("Removing cart item:", id)
			const response = await removeCartItemAPI(Number(id))

			if (response.error) {
				toast.error("Error al eliminar el ítem del carrito: " + response.message)
				return
			}

			// Recargar el carrito desde la API para obtener el estado actualizado
			await loadCartFromAPI()
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
			console.log("Clearing cart...")
			const response = await clearCartAPI()

			if (response.error) {
				toast.error("Error al vaciar el carrito: " + response.message)
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

		// Validar que tenemos items con precios válidos antes de proceder
		const hasValidItems = cartItems.length > 0 && cartItems.every(item => 
			!isNaN(item.price) && item.price > 0 && !isNaN(item.quantity) && item.quantity > 0
		)

		if (!hasValidItems) {
			toast.error("Error: Los productos en el carrito no tienen precios válidos")
			return
		}

		// Procesar la compra usando la lógica existente del contexto de autenticación
		let allPurchasesSuccessful = true

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
		refreshCart: loadCartFromAPI,
	}
}
