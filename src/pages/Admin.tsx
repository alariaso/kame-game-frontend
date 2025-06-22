import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MOCK_CARDS, MOCK_CARD_PACKS } from "@/data/mockData"
import type { Card as CardType, CardPack } from "@/types"
import { toast } from "sonner"
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Search } from "lucide-react"
import AddCardForm from "@/components/admin/AddCardForm"
import AddPackForm from "@/components/admin/AddPackForm"

// Helper function to calculate package rarity based on cards
const calculatePackageRarity = (cards: CardType[]): string => {
	if (cards.length === 0) return "common" // Default if no cards

	// Map rarities to numerical values
	const rarityValues: Record<string, number> = {
		common: 1,
		rare: 2,
		"ultra-rare": 3,
		legendary: 4,
	}

	// Calculate average rarity
	const total = cards.reduce(
		(sum, card) => sum + rarityValues[card.rarity],
		0
	)
	const average = total / cards.length

	// Determine package rarity based on average
	if (average >= 1.0 && average < 1.5) return "common"
	if (average >= 1.5 && average < 2.5) return "rare"
	if (average >= 2.5 && average < 3.5) return "super-rare"
	if (average >= 3.5) return "ultra-rare"

	return "common" // Default fallback
}

const Admin: React.FC = () => {
	const [cards, setCards] = useState<CardType[]>(MOCK_CARDS)
	const [packs, setPacks] = useState<CardPack[]>(MOCK_CARD_PACKS)
	const [searchTerm, setSearchTerm] = useState("")
	const [editingCardId, setEditingCardId] = useState<string | null>(null)
	const [editingPackId, setEditingPackId] = useState<string | null>(null)
	const [addCardDialogOpen, setAddCardDialogOpen] = useState(false)
	const [addPackDialogOpen, setAddPackDialogOpen] = useState(false)

	// Filtrar elementos según la búsqueda
	const filteredCards = cards.filter((card) =>
		card.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const filteredPacks = packs.filter((pack) =>
		pack.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

	// Función para modificar el precio de una carta
	const updateCardPrice = (id: string, change: number) => {
		setCards(
			cards.map((card) => {
				if (card.id === id) {
					const newPrice = Math.max(0, card.price + change)
					return { ...card, price: newPrice }
				}
				return card
			})
		)

		toast.success("Precio actualizado correctamente")
	}

	// Función para modificar el stock de una carta
	const updateCardStock = (id: string, change: number) => {
		setCards(
			cards.map((card) => {
				if (card.id === id) {
					const newStock = Math.max(0, card.stock + change)
					return { ...card, stock: newStock }
				}
				return card
			})
		)

		toast.success("Stock actualizado correctamente")
	}

	// Función para eliminar una carta
	const deleteCard = (id: string) => {
		setCards(cards.filter((card) => card.id !== id))
		toast.success("Carta eliminada correctamente")
	}

	// Función para modificar el precio de un paquete
	const updatePackPrice = (id: string, change: number) => {
		setPacks(
			packs.map((pack) => {
				if (pack.id === id) {
					const newPrice = Math.max(0, pack.price + change)
					return { ...pack, price: newPrice }
				}
				return pack
			})
		)

		toast.success("Precio actualizado correctamente")
	}

	// Función para modificar el stock de un paquete
	const updatePackStock = (id: string, change: number) => {
		setPacks(
			packs.map((pack) => {
				if (pack.id === id) {
					const newStock = Math.max(0, pack.stock + change)
					return { ...pack, stock: newStock }
				}
				return pack
			})
		)

		toast.success("Stock actualizado correctamente")
	}

	// Handler para añadir una nueva carta
	const handleAddCard = (cardData: CardType) => {
		setCards([...cards, cardData])
	}

	// Handler para añadir un nuevo paquete
	const handleAddPack = (
		packData: Omit<CardPack, "rarity" | "cardCount">
	) => {
		const packageCards = cards.filter((card) =>
			packData.cardIds.includes(card.id)
		)
		const calculatedRarity = calculatePackageRarity(packageCards)

		const newPack: CardPack = {
			...packData,
			rarity: calculatedRarity,
			cardCount: packData.cardIds.length,
		}

		setPacks([...packs, newPack])
	}

	// Renderiza fila de la tabla de cartas
	const renderCardRow = (card: CardType) => {
		const isEditing = editingCardId === card.id

		return (
			<tr
				key={card.id}
				className={`border-b border-gold/10 ${isEditing ? "bg-gold/5" : ""}`}
			>
				<td className="py-3 px-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded overflow-hidden">
							<img
								src={card.imageUrl}
								alt={card.name}
								className="w-full h-full object-cover"
							/>
						</div>
						<span className="font-medium text-gold">
							{card.name}
						</span>
					</div>
				</td>
				<td className="py-3 px-4">
					<span
						className={`inline-block px-2 py-1 rounded-full text-xs ${getTypeColor(card.type)}`}
					>
						{formatType(card.type)}
					</span>
				</td>
				<td className="py-3 px-4">
					<span
						className={`inline-block px-2 py-1 rounded-full text-xs ${getRarityColor(card.rarity)}`}
					>
						{formatRarity(card.rarity)}
					</span>
				</td>
				<td className="py-3 px-4">
					{isEditing ? (
						<div className="flex items-center">
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-red-500"
								onClick={() => updateCardPrice(card.id, -100)}
							>
								<ArrowDown size={16} />
							</Button>
							<span className="mx-2">${card.price}</span>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-green-500"
								onClick={() => updateCardPrice(card.id, 100)}
							>
								<ArrowUp size={16} />
							</Button>
						</div>
					) : (
						<span>${card.price}</span>
					)}
				</td>
				<td className="py-3 px-4">
					{isEditing ? (
						<div className="flex items-center">
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-red-500"
								onClick={() => updateCardStock(card.id, -1)}
								disabled={card.stock <= 0}
							>
								<ArrowDown size={16} />
							</Button>
							<span className="mx-2">{card.stock}</span>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-green-500"
								onClick={() => updateCardStock(card.id, 1)}
							>
								<ArrowUp size={16} />
							</Button>
						</div>
					) : (
						<span>{card.stock}</span>
					)}
				</td>
				<td className="py-3 px-4">
					<div className="flex gap-2 justify-end">
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-gold hover:bg-gold/10"
							onClick={() =>
								isEditing
									? setEditingCardId(null)
									: setEditingCardId(card.id)
							}
						>
							<Edit size={16} />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-red-500 hover:bg-red-500/10"
							onClick={() => deleteCard(card.id)}
						>
							<Trash2 size={16} />
						</Button>
					</div>
				</td>
			</tr>
		)
	}

	// Renderiza fila de la tabla de paquetes
	const renderPackRow = (pack: CardPack) => {
		const isEditing = editingPackId === pack.id

		return (
			<tr
				key={pack.id}
				className={`border-b border-gold/10 ${isEditing ? "bg-gold/5" : ""}`}
			>
				<td className="py-3 px-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded overflow-hidden">
							<img
								src={pack.imageUrl}
								alt={pack.name}
								className="w-full h-full object-cover"
							/>
						</div>
						<span className="font-medium text-gold">
							{pack.name}
						</span>
					</div>
				</td>
				<td className="py-3 px-4">
					<span>{pack.cardCount} cartas</span>
				</td>
				<td className="py-3 px-4">
					<span
						className={`inline-block px-2 py-1 rounded-full text-xs ${getPackRarityColor(pack.rarity)}`}
					>
						{formatPackRarity(pack.rarity)}
					</span>
				</td>
				<td className="py-3 px-4">
					<span
						className={`
					 inline-block px-2 py-1 rounded-full text-xs font-medium
					 ${
							pack.discount >= 0.3
								? "bg-green-600/20 text-green-400 border border-green-400/30"
								: pack.discount >= 0.15
									? "bg-blue-600/20 text-blue-400 border border-blue-400/30"
									: "bg-gray-600/20 text-gray-400 border border-gray-400/30"
						}
				  `}
					>
						{Math.round(pack.discount * 100)}%
					</span>
				</td>
				<td className="py-3 px-4">
					{isEditing ? (
						<div className="flex items-center">
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-red-500"
								onClick={() => updatePackPrice(pack.id, -100)}
							>
								<ArrowDown size={16} />
							</Button>
							<span className="mx-2">${pack.price}</span>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-green-500"
								onClick={() => updatePackPrice(pack.id, 100)}
							>
								<ArrowUp size={16} />
							</Button>
						</div>
					) : (
						<span>${pack.price}</span>
					)}
				</td>
				<td className="py-3 px-4">
					{isEditing ? (
						<div className="flex items-center">
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-red-500"
								onClick={() => updatePackStock(pack.id, -1)}
								disabled={pack.stock <= 0}
							>
								<ArrowDown size={16} />
							</Button>
							<span className="mx-2">{pack.stock}</span>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-green-500"
								onClick={() => updatePackStock(pack.id, 1)}
							>
								<ArrowUp size={16} />
							</Button>
						</div>
					) : (
						<span>{pack.stock}</span>
					)}
				</td>
				<td className="py-3 px-4">
					<div className="flex gap-2 justify-end">
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-gold hover:bg-gold/10"
							onClick={() =>
								isEditing
									? setEditingPackId(null)
									: setEditingPackId(pack.id)
							}
						>
							<Edit size={16} />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-red-500 hover:bg-red-500/10"
							onClick={() => deleteCard(pack.id)}
						>
							<Trash2 size={16} />
						</Button>
					</div>
				</td>
			</tr>
		)
	}

	// Funciones de utilidad para formatear y colorear
	const formatType = (type: string): string => {
		switch (type) {
			case "monster":
				return "Monstruo"
			case "spell":
				return "Hechizo"
			case "trap":
				return "Trampa"
			default:
				return type
		}
	}

	const getTypeColor = (type: string): string => {
		switch (type) {
			case "monster":
				return "bg-red-800 text-white"
			case "spell":
				return "bg-green-800 text-white"
			case "trap":
				return "bg-purple-800 text-white"
			default:
				return "bg-gray-600 text-white"
		}
	}

	const formatRarity = (rarity: string): string => {
		switch (rarity) {
			case "common":
				return "Común"
			case "rare":
				return "Rara"
			case "ultra-rare":
				return "Ultra Rara"
			case "legendary":
				return "Legendaria"
			default:
				return rarity
		}
	}

	const getRarityColor = (rarity: string): string => {
		switch (rarity) {
			case "common":
				return "bg-gray-600 text-white"
			case "rare":
				return "bg-blue-600 text-white"
			case "ultra-rare":
				return "bg-purple-600 text-white"
			case "legendary":
				return "bg-gold text-black"
			default:
				return "bg-gray-600 text-white"
		}
	}

	// New functions for pack rarity
	const formatPackRarity = (rarity: string): string => {
		switch (rarity) {
			case "common":
				return "Común"
			case "rare":
				return "Rara"
			case "super-rare":
				return "Super Rara"
			case "ultra-rare":
				return "Ultra Rara"
			default:
				return rarity
		}
	}

	const getPackRarityColor = (rarity: string): string => {
		switch (rarity) {
			case "Común":
				return "bg-gray-600 text-white"
			case "Rara":
				return "bg-blue-600 text-white"
			case "Super Rara":
				return "bg-purple-600 text-white"
			case "Ultra Rara":
				return "bg-gold text-black"
			default:
				return "bg-gray-600 text-white"
		}
	}

	return (
		<div className="min-h-[calc(100vh-73px)] py-8 px-6">
			<div className="container mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gold mb-2">
						Panel de Administración
					</h1>
					<p className="text-gray-400">
						Gestiona inventario, precios y crea nuevos productos
						para el Mercado Místico.
					</p>
				</div>

				{/* Forms for adding cards and packs */}
				<AddCardForm
					open={addCardDialogOpen}
					onOpenChange={setAddCardDialogOpen}
					onAddCard={handleAddCard}
				/>
				<AddPackForm
					open={addPackDialogOpen}
					onOpenChange={setAddPackDialogOpen}
					onAddPack={handleAddPack}
					cards={cards}
				/>

				{/* Tabs para Cartas y Paquetes */}
				<Tabs defaultValue="cards" className="w-full">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
						<TabsList className="bg-black/40 border border-gold/10">
							<TabsTrigger
								value="cards"
								className="data-[state=active]:bg-gold data-[state=active]:text-black"
							>
								Cartas
							</TabsTrigger>
							<TabsTrigger
								value="packs"
								className="data-[state=active]:bg-gold data-[state=active]:text-black"
							>
								Paquetes
							</TabsTrigger>
						</TabsList>

						<div className="relative w-full sm:w-auto">
							<Search
								className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
								size={18}
							/>
							<Input
								type="text"
								placeholder="Buscar..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 bg-black/30 border-gold/20 focus:border-gold w-full sm:w-64"
							/>
						</div>
					</div>

					<TabsContent value="cards" className="mt-0">
						<Card className="bg-black/20 border-gold/10">
							<CardHeader className="flex flex-col md:flex-row items-center justify-between pb-2">
								<CardTitle className="text-gold text-sm md:text-2xl">
									Gestión de Cartas
								</CardTitle>
								<Button
									className="bg-gold hover:bg-gold-dark text-black font-medium"
									onClick={() => setAddCardDialogOpen(true)}
								>
									<Plus size={18} className="mr-2" />
									Nueva Carta
								</Button>
							</CardHeader>
							<CardContent>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead className="bg-black/40 text-left">
											<tr>
												<th className="py-3 px-4 font-medium">
													Carta
												</th>
												<th className="py-3 px-4 font-medium">
													Tipo
												</th>
												<th className="py-3 px-4 font-medium">
													Rareza
												</th>
												<th className="py-3 px-4 font-medium">
													Precio
												</th>
												<th className="py-3 px-4 font-medium">
													Stock
												</th>
												<th className="py-3 px-4 font-medium text-right">
													Acciones
												</th>
											</tr>
										</thead>
										<tbody>
											{filteredCards.length > 0 ? (
												filteredCards.map(renderCardRow)
											) : (
												<tr>
													<td
														colSpan={6}
														className="py-6 text-center text-gray-400"
													>
														No se encontraron cartas
														que coincidan con tu
														búsqueda.
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="packs" className="mt-0">
						<Card className="bg-black/20 border-gold/10">
							<CardHeader className="flex flex-col md:flex-row items-center justify-between pb-2">
								<CardTitle className="text-gold text-sm md:text-2xl">
									Gestión de Paquetes
								</CardTitle>
								<Button
									className="bg-gold hover:bg-gold-dark text-black font-medium"
									onClick={() => setAddPackDialogOpen(true)}
								>
									<Plus size={18} className="mr-2" />
									Nuevo Paquete
								</Button>
							</CardHeader>
							<CardContent>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead className="bg-black/40 text-left">
											<tr>
												<th className="py-3 px-4 font-medium">
													Paquete
												</th>
												<th className="py-3 px-4 font-medium">
													Contenido
												</th>
												<th className="py-3 px-4 font-medium">
													Rareza
												</th>
												<th className="py-3 px-4 font-medium">
													Descuento
												</th>
												<th className="py-3 px-4 font-medium">
													Precio
												</th>
												<th className="py-3 px-4 font-medium">
													Stock
												</th>
												<th className="py-3 px-4 font-medium text-right">
													Acciones
												</th>
											</tr>
										</thead>
										<tbody>
											{filteredPacks.length > 0 ? (
												filteredPacks.map(renderPackRow)
											) : (
												<tr>
													<td
														colSpan={7}
														className="py-6 text-center text-gray-400"
													>
														No se encontraron
														paquetes que coincidan
														con tu búsqueda.
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{/* Estadísticas */}
				<div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<Card className="bg-black/20 border-gold/10">
						<CardHeader className="pb-2">
							<CardTitle className="text-lg text-gold">
								Total de Cartas
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-3xl font-bold">{cards.length}</p>
						</CardContent>
					</Card>

					<Card className="bg-black/20 border-gold/10">
						<CardHeader className="pb-2">
							<CardTitle className="text-lg text-gold">
								Total de Paquetes
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-3xl font-bold">{packs.length}</p>
						</CardContent>
					</Card>

					<Card className="bg-black/20 border-gold/10">
						<CardHeader className="pb-2">
							<CardTitle className="text-lg text-gold">
								Valor del Inventario
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-3xl font-bold">
								$
								{cards.reduce(
									(sum, card) =>
										sum + card.price * card.stock,
									0
								) +
									packs.reduce(
										(sum, pack) =>
											sum + pack.price * pack.stock,
										0
									)}
							</p>
						</CardContent>
					</Card>

					<Card className="bg-black/20 border-gold/10">
						<CardHeader className="pb-2">
							<CardTitle className="text-lg text-gold">
								Bajo Stock
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-3xl font-bold">
								{cards.filter((card) => card.stock < 5).length +
									packs.filter((pack) => pack.stock < 5)
										.length}
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}

export default Admin
