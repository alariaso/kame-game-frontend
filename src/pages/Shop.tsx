
import React, { useState, useContext, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CartContext } from "@/App"
import { getCards } from "@/services/api"
import { toast } from "sonner"

type ProductCategory = "Cartas Individuales" | "Paquetes"
type Filter = "cardKind" | "packRarity"

const Shop: React.FC = () => {
	const { getAvailablePacks } = useAuth()
	const [activeTab, setActiveTab] = useState<string>("cards")
	const [searchTerm, setSearchTerm] = useState<string>("")
	const [filters, setFilters] = useState<Record<Filter, string | null>>({
		cardKind: null,
		packRarity: null,
	})
	const [apiCards, setApiCards] = useState<any[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [totalPages, setTotalPages] = useState<number>(1)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const cart = useContext(CartContext)

	// Cargar cartas desde la API
	useEffect(() => {
		const loadCards = async () => {
			setLoading(true)
			try {
				const response = await getCards(currentPage, 20)
				if (response.error) {
					toast.error("Error al cargar las cartas: " + response.message)
				} else {
					setApiCards(response.data?.results || [])
					setTotalPages(response.data?.totalPages || 1)
				}
			} catch (error) {
				console.error("Error loading cards:", error)
				toast.error("Error de conexión al cargar las cartas")
			}
			setLoading(false)
		}

		if (activeTab === "cards") {
			loadCards()
		}
	}, [activeTab, currentPage])

	// define filters according to the category
	const categoryMap: Record<string, ProductCategory> = {
		cards: "Cartas Individuales",
		packs: "Paquetes",
	}

	const extraFilters: Record<ProductCategory, Filter[]> = {
		"Cartas Individuales": ["cardKind"],
		Paquetes: ["packRarity"],
	}

	const filterInfo: Record<Filter, { title: string; values: string[] }> = {
		cardKind: {
			title: "Tipo",
			values: [
				"DARK",
				"DIVINE",
				"EARTH",
				"FIRE",
				"LIGHT",
				"WATER",
				"WIND",
			],
		},
		packRarity: {
			title: "Rareza",
			values: ["Común", "Rara", "Super Rara", "Ultra Rara"],
		},
	}

	// Filtrar cartas de la API
	const filteredApiCards = apiCards.filter((card) => {
		const matchesSearch = card.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
		const matchesFilter = filters.cardKind
			? card.attribute === filters.cardKind
			: true
		return matchesSearch && matchesFilter
	})

	const availablePacks = getAvailablePacks().filter((pack) => {
		const matchesSearch = pack.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
		const matchesFilter = filters.packRarity
			? pack.rarity === filters.packRarity
			: true
		return matchesSearch && matchesFilter
	})

	// manage changes in the filters
	const handleFilterChange = (filterName: Filter, value: string) => {
		setFilters((prev) => ({
			...prev,
			[filterName]: value === "all" ? null : value,
		}))
	}

	return (
		<div className="container mx-auto py-6 px-4 sm:px-6">
			<h1 className="text-2xl sm:text-3xl font-bold text-gold mb-6">
				Tienda de Cartas
			</h1>

			{/* search bar and filters */}
			<div className="mb-6 flex flex-col md:flex-row gap-3">
				<input
					type="text"
					placeholder="Buscar por nombre..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="flex-1 px-4 py-2 bg-black/30 border border-gold/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gold"
				/>

				{extraFilters[categoryMap[activeTab]].map((filterKey) => {
					const filter = filterInfo[filterKey]
					return (
						<select
							key={filterKey}
							value={filters[filterKey] || "all"}
							onChange={(e) =>
								handleFilterChange(filterKey, e.target.value)
							}
							className="px-4 py-2 bg-black/30 border border-gold/20 rounded text-white focus:outline-none focus:ring-1 focus:ring-gold"
						>
							<option value="all">
								Todos los {filter.title.toLowerCase()}
							</option>
							{filter.values.map((value) => (
								<option key={value} value={value}>
									{value}
								</option>
							))}
						</select>
					)
				})}
			</div>

			<Tabs
				defaultValue="cards"
				className="w-full"
				onValueChange={(value) => setActiveTab(value)}
			>
				<TabsList className="mb-6 bg-black/30 border border-gold/20">
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

				<TabsContent value="cards">
					{loading ? (
						<div className="text-center py-8 text-gray-400">
							Cargando cartas...
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							{filteredApiCards.length === 0 ? (
								<div className="col-span-full text-center py-8 text-gray-400">
									No hay cartas disponibles con estos filtros
								</div>
							) : (
								filteredApiCards.map((card) => (
									<Card
										key={card.id || card.name}
										className="overflow-hidden bg-black/40 border-gold/30 transition-all hover:shadow-md hover:shadow-gold/20"
									>
										<div className="aspect-[3/4] overflow-hidden">
											<img
												src={card.imageUrl}
												alt={card.name}
												className="w-full h-full object-cover transition-transform hover:scale-110"
											/>
										</div>
										<div className="p-3">
											<h3 className="font-medium text-gold truncate">
												{card.name}
											</h3>
											<div className="flex justify-between items-center mt-2">
												<span className="text-sm text-gray-300">
													ATK: {card.attack}
												</span>
												<span className="font-bold">
													${card.price}
												</span>
											</div>
											<div className="flex justify-between items-center mt-1">
												<span className="text-xs text-gray-400">
													{card.attribute}
												</span>
											</div>
											<button
												className="w-full mt-3 py-1.5 px-3 bg-gold hover:bg-gold/80 text-black text-sm font-semibold rounded-sm transition-colors"
												onClick={() =>
													cart?.addToCart({
														...card,
														category: "card",
														id: card.id || card.name,
														image_url: card.imageUrl,
														kind: card.attribute,
														stock: 1
													}, "card")
												}
											>
												Agregar al carrito
											</button>
										</div>
									</Card>
								))
							)}
						</div>
					)}
				</TabsContent>

				<TabsContent value="packs">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{availablePacks.length === 0 ? (
							<div className="col-span-full text-center py-8 text-gray-400">
								No hay paquetes disponibles con estos filtros
							</div>
						) : (
							availablePacks.map((pack) => (
								<Card
									key={pack.id}
									className="overflow-hidden bg-black/40 border-gold/30 transition-all hover:shadow-md hover:shadow-gold/20"
								>
									<div className="aspect-video overflow-hidden">
										<img
											src={pack.imageUrl}
											alt={pack.name}
											className="w-full h-full object-cover transition-transform hover:scale-110"
										/>
									</div>
									<div className="p-3">
										<h3 className="font-medium text-gold">
											{pack.name}
										</h3>
										<p className="text-xs text-gray-400 mt-1">
											{pack.description}
										</p>
										<div className="flex justify-between items-center mt-2">
											<div className="flex flex-col">
												<span className="text-sm text-gray-300">
													Contiene {pack.cardCount}{" "}
													cartas
												</span>
												<span className="text-sm text-gray-300">
													Stock: {pack.stock}
												</span>
											</div>
											<span className="font-bold">
												${pack.price}
											</span>
										</div>
										<button
											className="w-full mt-3 py-1.5 px-3 bg-gold hover:bg-gold/80 text-black text-sm font-semibold rounded-sm transition-colors"
											onClick={() =>
												cart?.addToCart(pack, "pack")
											}
											disabled={pack.stock <= 0}
										>
											Agregar al carrito
										</button>
									</div>
								</Card>
							))
						)}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default Shop
