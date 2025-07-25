import React, { useState, useEffect, useRef, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { number, z } from "zod"
import { toast } from "sonner"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import type { Card as CardType, CardPack, Pack } from "@/types"
import { Search, X } from "lucide-react"
import { createPack, addCartToPack, getCards } from "@/services/api"

const formSchema = z.object({
	name: z
		.string()
		.min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
	description: z.string().min(10, {
		message: "La descripción debe tener al menos 10 caracteres",
	}),
	price: z.string().min(1, { message: "El precio es requerido" }),
	imageUrl: z.string().url({ message: "Debe ser una URL válida" }),
	stock: z.string().min(1, { message: "El stock es requerido" }),
	discount: z.string().min(1, { message: "El descuento es requerido" }),
})

type FormValues = z.infer<typeof formSchema>

interface AddPackFormProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onAddPack: (packData: CardPack) => void
}

const AddPackForm: React.FC<AddPackFormProps> = ({
	open,
	onOpenChange,
	onAddPack,
}) => {
	const [selectedCards, setSelectedCards] = useState<string[]>([])
	const [cardSearch, setCardSearch] = useState("")
	const [cards, setCards] = useState<CardType[]>([])
	const [loading, setLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const scrollRef = useRef<HTMLDivElement>(null)

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			price: "",
			imageUrl: "",
			stock: "1",
			discount: "10",
		},
	})

	const fetchCards = useCallback(
		async (page: number, reset: boolean = false) => {
			if (loading) return

			setLoading(true)
			try {
				const response = await getCards(page, 10)
				if (response.status === 200 && response.data) {
					const newCards = response.data.results || []
					setCards((prevCards) =>
						reset ? newCards : [...prevCards, ...newCards]
					)
					setHasMore(page < response.data.totalPages)
				}
			} catch (error) {
				console.error("Error fetching cards:", error)
				toast.error("Error al cargar las cartas")
			} finally {
				setLoading(false)
			}
		},
		[loading]
	)

	useEffect(() => {
		if (open) {
			setCards([])
			setCurrentPage(1)
			setHasMore(true)
			fetchCards(1, true)
		}
	}, [open])

	const handleScroll = useCallback(() => {
		const scrollContainer = scrollRef.current
		if (!scrollContainer || loading || !hasMore) return

		const { scrollTop, scrollHeight, clientHeight } = scrollContainer
		if (scrollTop + clientHeight >= scrollHeight - 5) {
			setCurrentPage((prevPage) => {
				const nextPage = prevPage + 1
				fetchCards(nextPage)
				return nextPage
			})
		}
	}, [loading, hasMore, fetchCards])

	useEffect(() => {
		const scrollContainer = scrollRef.current
		if (scrollContainer) {
			scrollContainer.addEventListener("scroll", handleScroll)
			return () =>
				scrollContainer.removeEventListener("scroll", handleScroll)
		}
	}, [handleScroll])

	const onSubmit = async (data: FormValues) => {
		if (selectedCards.length < 2) {
			toast.error("Debes seleccionar al menos 2 cartas")
			return
		}

		try {
			const valueDiscount = Number(data.discount) / 100 | 0;
			const packData: Pack = {
				name: data.name,
				description: data.description,
				price: Number(data.price),
				stock: Number(data.stock),
				discount: valueDiscount,
				imageUrl: data.imageUrl,
				rarity: "COMMON",
			}

			console.log("Selected Cards:", selectedCards)

			const cardIds = selectedCards.map((el) => Number(el));
			const responseCreatedPack = await createPack(packData)
			const responseAddCards = await addCartToPack(
				responseCreatedPack.data.id,
				cardIds
			)

			const packItem: CardPack = {
				...packData,
				id: responseCreatedPack.data.id,
				cardIds: selectedCards,
				cardCount: selectedCards.length,
			}

			onAddPack(packItem)
			toast.success("Paquete creado exitosamente")
			form.reset()
			setSelectedCards([])
			setCardSearch("")
			onOpenChange(false)
		} catch (error) {
			console.error("Error creating card:", error)
			toast.error("Error de conexión al crear la carta")
		}
	}

	const filteredCards = cards.filter(
		(card) =>
			card.name.toLowerCase().includes(cardSearch.toLowerCase()) &&
			!selectedCards.includes(card.id)
	)

	const addCardToPack = (cardId: string) => {
		if (!selectedCards.includes(cardId)) {
			setSelectedCards([...selectedCards, cardId])
		}
	}

	const removeCardFromPack = (cardId: string) => {
		setSelectedCards(selectedCards.filter((id) => id !== cardId))
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-background border-gold/30 sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold text-gold">
						Crear Nuevo Paquete
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nombre</FormLabel>
										<FormControl>
											<Input
												placeholder="Nombre del paquete"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Precio (Yugi Pesos)
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Precio del paquete"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="stock"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Stock</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Unidades disponibles"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="discount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Descuento (%)</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Porcentaje de descuento"
												min="0"
												max="100"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="imageUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>URL de imagen</FormLabel>
									<FormControl>
										<Input
											placeholder="URL de la imagen del paquete"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descripción</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Descripción del paquete"
											className="resize-none min-h-[100px] bg-black/30 border-gold/20"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="space-y-2">
							<FormLabel>
								Cartas en el paquete ({selectedCards.length})
							</FormLabel>
							{selectedCards.length > 0 ? (
								<div className="flex flex-wrap gap-2 p-2 border border-gold/20 rounded bg-black/30">
									{selectedCards.map((cardId) => {
										const card = cards.find(
											(c) => c.id === cardId
										)
										return card ? (
											<div
												key={cardId}
												className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded border border-gold/30"
											>
												<span className="text-sm">
													{card.name}
												</span>
												<button
													type="button"
													onClick={() =>
														removeCardFromPack(
															cardId
														)
													}
													className="text-red-500 hover:text-red-300"
												>
													<X size={14} />
												</button>
											</div>
										) : null
									})}
								</div>
							) : (
								<div className="p-4 text-center text-gray-400 border border-gold/20 rounded bg-black/30">
									No hay cartas seleccionadas
								</div>
							)}
						</div>

						<div className="space-y-2">
							<FormLabel>Añadir cartas</FormLabel>
							<div className="relative">
								<Search
									className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
									size={16}
								/>
								<Input
									type="text"
									placeholder="Buscar cartas..."
									value={cardSearch}
									onChange={(e) =>
										setCardSearch(e.target.value)
									}
									className="pl-10 bg-black/30 border-gold/20"
								/>
							</div>

							<div
								ref={scrollRef}
								className="max-h-60 overflow-y-auto border border-gold/20 rounded"
							>
								{filteredCards.length === 0 && !loading ? (
									<div className="p-4 text-center text-gray-400">
										{cardSearch
											? "No se encontraron cartas"
											: "Cargando cartas..."}
									</div>
								) : (
									<ul className="divide-y divide-gold/10">
										{filteredCards.map((card) => (
											<li
												key={card.id}
												className="p-2 hover:bg-gold/10 flex justify-between items-center"
											>
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded overflow-hidden border border-gold/20">
														<img
															src={card.imageUrl}
															alt={card.name}
															className="w-full h-full object-cover"
														/>
													</div>
													<span>{card.name}</span>
												</div>
												<Button
													type="button"
													size="sm"
													onClick={() =>
														addCardToPack(card.id)
													}
													className="bg-gold hover:bg-gold/80 text-black"
												>
													Añadir
												</Button>
											</li>
										))}
										{loading && (
											<li className="p-4 text-center text-gray-400">
												Cargando más cartas...
											</li>
										)}
									</ul>
								)}
							</div>
						</div>

						<div className="flex justify-end gap-2 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									onOpenChange(false)
									form.reset()
									setSelectedCards([])
									setCardSearch("")
								}}
								className="border-gold/30 text-gold hover:bg-gold/10"
							>
								Cancelar
							</Button>
							<Button
								type="submit"
								className="bg-gold hover:bg-gold/80 text-black"
							>
								Guardar Paquete
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default AddPackForm
