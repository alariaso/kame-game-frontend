
import { useState } from "react"
import { Card as CardType, CardPack } from "@/types"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

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

	const addToCart = (
		item: CardType | CardPack,
		itemType: "card" | "pack"
	) => {
		if (!isAuthenticated) {
			toast.error("Debes iniciar sesión para agregar al carrito")
			return
		}

		setCartItems((prevItems) => {
			// Verificar si el ítem ya está en el carrito
			const existingItemIndex = prevItems.findIndex(
				(cartItem) => cartItem.id === item.id && cartItem.type === itemType
			)

			if (existingItemIndex >= 0) {
				// Si ya existe, incrementar la cantidad
				const updatedItems = [...prevItems]
				updatedItems[existingItemIndex].quantity += 1
				return updatedItems
			} else {
				// Si no existe, agregarlo al carrito
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

	const removeCartItem = (id: string) => {
		setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
	}

	const clearCart = () => {
		setCartItems([])
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
	}
}
