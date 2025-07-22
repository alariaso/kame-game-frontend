import React, { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { getInventory } from "@/services/api"
import { toast } from "sonner"
import type { CardKind } from "@/types"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import PackContentsModal from "@/components/PackContentsModal"

const Inventory: React.FC = () => {
	const [cards, setCards] = useState<any[]>([])
	const [searchTerm, setSearchTerm] = useState("")
	const [filter, setFilter] = useState<CardKind | null>(null)
	const [loading, setLoading] = useState(false);
	const [totalPages, setTotalPages] = useState<number>(1)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [isPackModalOpen, setIsPackModalOpen] = useState(false)
	const [selectedPackId, setSelectedPackId] = useState<number | null>(null)
	const [selectedPackName, setSelectedPackName] = useState("")

	// Cargar el inventario del usuario desde la API real
	useEffect(() => {
		const loadInventory = async () => {
			setLoading(true);

			try {
				const response = await getInventory(
					currentPage,
					12,
					searchTerm || undefined,
					filter || undefined
				)

				if (response.error) {
					console.error("Error loading inventory:", response.message);
					toast.error("Error al cargar el inventario: " + response.message);
					setCards([]);
					setTotalPages(1);
				} else {
					// Usar los datos reales de la API
					setCards(response.data?.results || []);
					setTotalPages(response.data?.totalPages || 1);
				}
			} catch (err) {
				console.error("Error loading inventory: ", err);
				toast.error("Error de conexión al cargar el inventario");
				setCards([]);
				setTotalPages(1);
			}

			setLoading(false);
		}

		loadInventory();
	}, [searchTerm, filter, currentPage]);

	useEffect(() => {
		setCurrentPage(1)
	}, [searchTerm, filter]);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page)
		}
	}

	const handlePackClick = (item: any) => {
		// Solo abrir modal si es un paquete
		if (item.category === "pack" || item.type === "pack") {
			console.log("Pack clicked in inventory:", item)
			setSelectedPackId(item.id)
			setSelectedPackName(item.name)
			setIsPackModalOpen(true)
		}
	}

	// Renderiza una tarjeta de carta del inventario real
	const renderCardItem = (card: any) => {
		const isPack = card.category === "pack" || card.type === "pack"
		
		return (
			<Card
				key={card.id || card.name}
				className={`overflow-hidden bg-black/40 border-gold/30 transition-all hover:shadow-md hover:shadow-gold/20 ${isPack ? 'cursor-pointer' : ''}`}
				onClick={() => isPack && handlePackClick(card)}
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
						<span className="text-sm text-gray-300">
							Cantidad: {card.amount}
						</span>
					</div>
					<div className="flex justify-between items-center mt-1">
						<span className="text-xs text-gray-400">
							{card.attribute}
						</span>
					</div>
				</div>
			</Card>
		)
	}

	const kinds = [
		"DARK",
		"DIVINE",
		"EARTH",
		"FIRE",
		"LIGHT",
		"WATER",
		"WIND",
	]

	return (
		<div className="container mx-auto py-6 px-4 sm:px-6">
			<h1 className="text-2xl sm:text-3xl font-bold text-gold mb-6">
				Inventario
			</h1>
			<p className="text-gray-400 mb-2">Organiza tu inventario</p>

			<div className="mb-6 flex flex-col md:flex-row gap-3">
				<input
					type="text"
					placeholder="Buscar por nombre..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="flex-1 px-4 py-2 bg-black/30 border border-gold/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gold"
				/>
				<select
					key={filter}
					value={filter || "all"}
					onChange={(e) => {
						const value = e.target.value;
						setFilter(value === "all" ? null : (value as CardKind))
					}}
					className="px-4 py-2 bg-black/30 border border-gold/20 rounded text-white focus:outline-none focus:ring-1 focus:ring-gold"
				>
					<option value="all">
						Todos los tipos
					</option>
					{kinds.map((kind) => (
						<option key={kind} value={kind}>
							{kind}
						</option>
					))}
				</select>
			</div>

			{loading ? (
				<div className="text-center py-12">
					<p className="text-gray-400">Cargando inventario...</p>
				</div>
			) : cards.length > 0 ? (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{cards.map(renderCardItem)}
					</div>

					{totalPages > 1 && (
						<div className="mt-8 flex justify-center">
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious
											onClick={() => handlePageChange(currentPage - 1)}
											className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-gold/10"}
										/>
									</PaginationItem>

									{/* Páginas numeradas */}
									{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
										let pageNum;
										if (totalPages <= 5) {
											pageNum = i + 1;
										} else if (currentPage <= 3) {
											pageNum = i + 1;
										} else if (currentPage >= totalPages - 2) {
											pageNum = totalPages - 4 + i;
										} else {
											pageNum = currentPage - 2 + i;
										}

										return (
											<PaginationItem key={pageNum}>
												<PaginationLink
													onClick={() => handlePageChange(pageNum)}
													isActive={currentPage === pageNum}
													className="cursor-pointer hover:bg-gold/10 data-[state=active]:bg-gold data-[state=active]:text-black"
												>
													{pageNum}
												</PaginationLink>
											</PaginationItem>
										);
									})}

									<PaginationItem>
										<PaginationNext
											onClick={() => handlePageChange(currentPage + 1)}
											className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-gold/10"}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					)}
				</>
			) : (
				<div className="text-center py-12">
					<p className="text-gray-400">
						{searchTerm || filter 
							? "No se encontraron cartas en tu inventario con estos filtros" 
							: "No tienes cartas en tu inventario"}
					</p>
					{!searchTerm && !filter && (
						<p className="text-gray-500 mt-2">
							¡Ve a la tienda para comprar tus primeras cartas!
						</p>
					)}
				</div>
			)}

			<PackContentsModal
				isOpen={isPackModalOpen}
				onClose={() => setIsPackModalOpen(false)}
				packId={selectedPackId}
				packName={selectedPackName}
			/>
		</div>
	)
}

export default Inventory
