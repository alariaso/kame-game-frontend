import type { Card as CardType, CardPack } from "@/types"

export type CartItem = {
	id: string
	name: string
	price: number
	quantity: number
	imageUrl: string
	type: "card" | "pack"
	itemRef: CardType | CardPack
}
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

const CheckoutDialog = ({
	cartItems,
	cartCheckout,
}: {
	cartItems: CartItem[]
	cartCheckout: () => void
}) => {
	return (
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>
					Estos son los productos que vas a comprar
				</AlertDialogTitle>
				<div
					className={`flex flex-col gap-2 ${
						cartItems.length > 4
							? "max-h-96 overflow-y-auto pr-2"
							: ""
					}`}
				>
					{cartItems.map((item) => (
						<Card key={item.id} className="grid grid-cols-2">
							<CardHeader className="p-3">
								<CardTitle className="text-base">
									{item.name}
								</CardTitle>
							</CardHeader>

							<div className="w-full row-span-2 max-h-[100px] flex justify-end overflow-hidden rounded">
								<img
									className="object-cover rounded transition-transform duration-300 hover:scale-110"
									src={item.imageUrl}
									alt={item.name}
								/>
							</div>

							<CardContent>
								<CardDescription>
									Precio: ${item.price} x {item.quantity}{" "}
									<br />
									Tipo de Articulo: {item.type}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>

				<AlertDialogDescription>
					¿Estás seguro de que quieres proceder con la compra?.
					Después de confirmar, no podrás cambiar los productos y el
					dinero será descontado de tu cuenta
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Cancelar</AlertDialogCancel>
				<AlertDialogAction onClick={cartCheckout}>
					Continuar
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	)
}

export default CheckoutDialog
