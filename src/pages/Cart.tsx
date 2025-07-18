import React, { useContext, useEffect } from "react"
import { CartContext } from "@/App"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Minus, Trash2 } from "lucide-react"
import type { CardPack } from "@/types"
import CheckoutDialog from "@/components/cart/CheckoutDialog"

const Cart = () => {
	const cart = useContext(CartContext)

	// Actualizar el carrito cada vez que se abra
	useEffect(() => {
		if (cart?.cartOpen) {
			cart.refreshCart()
		}
	}, [cart?.cartOpen])

	if (!cart || cart.cartItems.length === 0) {
		return (
			<div className="container mx-auto py-12 px-4">
				<h1 className="text-2xl sm:text-3xl font-bold text-gold mb-6">
					Carrito de Compras
				</h1>
				<div className="bg-black/40 border border-gold/20 rounded-md p-8 text-center">
					<p className="text-gray-400">Tu carrito está vacío</p>
					<Button
						asChild
						className="mt-4 bg-gold hover:bg-gold/80 text-black font-medium"
					>
						<a href="/shop">Ir a la Tienda</a>
					</Button>
				</div>
			</div>
		)
	}

	const totalItems = cart.cartItems.reduce(
		(acc, item) => acc + item.quantity,
		0
	)

	// Calcular subtotal (precio sin descuentos)
	const subtotal = cart.cartItems.reduce((acc, item) => {
		if (item.type === "pack") {
			// Para paquetes, calcular el precio original (sin descuento)
			const pack = item.itemRef as CardPack
			const originalPrice = item.price / (1 - pack.discount) // Precio original antes del descuento
			return acc + originalPrice * item.quantity
		}
		// Para cartas individuales, usar el precio directo
		return acc + item.price * item.quantity
	}, 0)

	// Calcular descuento total
	const discount = cart.cartItems.reduce((acc, item) => {
		if (item.type === "pack") {
			const pack = item.itemRef as CardPack
			const originalPrice = item.price / (1 - pack.discount)
			const discountAmount = originalPrice - item.price
			return acc + discountAmount * item.quantity
		}
		return acc
	}, 0)

	// Precio total después del descuento
	const totalPrice = subtotal - discount

	return (
		<div className="container mx-auto py-12 px-4">
			<h1 className="text-2xl sm:text-3xl font-bold text-gold mb-6">
				Carrito de Compras
			</h1>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<Card className="bg-black/40 border-gold/20">
						<CardHeader className="border-b border-gold/10">
							<CardTitle>Productos ({totalItems})</CardTitle>
						</CardHeader>
						<CardContent className="divide-y divide-gold/10">
							{cart.cartItems.map((item) => (
								<div
									key={`${item.id}-${item.type}`}
									className="flex gap-4 py-4"
								>
									<div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
										<img
											src={item.imageUrl}
											alt={item.name}
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="flex-1">
										<h3 className="font-medium text-gold">
											{item.name}
										</h3>
										<p className="text-sm text-gray-400">
											{item.type === "card"
												? "Carta"
												: `Paquete (${(item.itemRef as CardPack).cardCount} cartas)`}
										</p>
										{item.type === "pack" && (
											<p className="text-xs text-green-400">
												¡Precio con descuento!
											</p>
										)}
										<div className="flex justify-between items-center mt-2">
											<span className="font-medium">
												${item.price}
											</span>
											<div className="flex items-center gap-2">
												<Button
													variant="outline"
													size="icon"
													className="h-7 w-7 p-0 border-gold/20"
													onClick={() =>
														cart.updateCartItemQuantity(
															item.id,
															-1
														)
													}
													disabled={
														item.quantity <= 1
													}
												>
													<Minus className="h-3 w-3" />
												</Button>
												<span className="w-6 text-center">
													{item.quantity}
												</span>
												<Button
													variant="outline"
													size="icon"
													className="h-7 w-7 p-0 border-gold/20"
													onClick={() =>
														cart.updateCartItemQuantity(
															item.id,
															1
														)
													}
												>
													<Plus className="h-3 w-3" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="h-7 w-7 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10"
													onClick={() =>
														cart.removeCartItem(
															item.id
														)
													}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				<div>
					<Card className="bg-black/40 border-gold/20">
						<CardHeader className="border-b border-gold/10">
							<CardTitle>Resumen de la compra</CardTitle>
						</CardHeader>
						<CardContent className="py-4">
							<div className="flex justify-between items-center mb-2">
								<span>Subtotal:</span>
								<span>${Math.round(subtotal)}</span>
							</div>
							{discount > 0 && (
								<div className="flex justify-between items-center mb-2">
									<span className="text-green-400">
										Descuento:
									</span>
									<span className="text-green-400">
										-${Math.round(discount)}
									</span>
								</div>
							)}
						</CardContent>
						<CardFooter className="flex-col border-t border-gold/10 pt-4">
							<div className="flex justify-between items-center w-full mb-4">
								<span className="font-medium">Total:</span>
								<span className="font-bold text-gold">
									${Math.round(totalPrice)}
								</span>
							</div>
							<AlertDialog>
								<AlertDialogTrigger className="w-full">
									<Button className="w-full bg-gold hover:bg-gold/80 text-black font-medium">
										Finalizar Compra
									</Button>
								</AlertDialogTrigger>
								<CheckoutDialog
									cartItems={cart.cartItems}
									cartCheckout={cart.checkout}
								/>
							</AlertDialog>

							<Button
								variant="outline"
								className="w-full mt-2 border-gold/20"
								onClick={cart.clearCart}
							>
								Vaciar Carrito
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	)
}

export default Cart
