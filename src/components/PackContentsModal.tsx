
import React, { useState, useEffect } from "react"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { getCardsOfPack } from "@/services/api"
import { toast } from "sonner"
import { X } from "lucide-react"

interface PackContentsModalProps {
	isOpen: boolean
	onClose: () => void
	packId: number | null
	packName: string
}

const PackContentsModal: React.FC<PackContentsModalProps> = ({
	isOpen,
	onClose,
	packId,
	packName,
}) => {
	const [cards, setCards] = useState<any[]>([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const loadPackContents = async () => {
			if (!isOpen || !packId) return

			setLoading(true)
			try {
				const response = await getCardsOfPack(packId)
				if (response.error) {
					toast.error("Error al cargar el contenido del paquete: " + response.message)
					setCards([])
				} else {
					setCards(response.data?.results || [])
				}
			} catch (error) {
				console.error("Error loading pack contents:", error)
				toast.error("Error de conexión al cargar el contenido del paquete")
				setCards([])
			} finally {
				setLoading(false)
			}
		}

		loadPackContents()
	}, [isOpen, packId])

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-black/90 border-gold/30">
				<DialogHeader>
					<DialogTitle className="text-gold text-xl">
						Contenido de {packName}
					</DialogTitle>
				</DialogHeader>

				{loading ? (
					<div className="text-center py-8">
						<p className="text-gray-400">Cargando contenido del paquete...</p>
					</div>
				) : cards.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
						{cards.map((card, index) => (
							<Card
								key={card.id || index}
								className="overflow-hidden bg-black/40 border-gold/30"
							>
								<div className="aspect-[3/4] overflow-hidden">
									<img
										src={card.imageUrl}
										alt={card.name}
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="p-3">
									<h3 className="font-medium text-gold truncate text-sm">
										{card.name}
									</h3>
									<div className="flex justify-between items-center mt-2">
										<span className="text-xs text-gray-300">
											ATK: {card.attack}
										</span>
										<span className="text-xs text-gray-400">
											{card.attribute}
										</span>
									</div>
								</div>
							</Card>
						))}
					</div>
				) : (
					<div className="text-center py-8">
						<p className="text-gray-400">
							No se encontraron cartas en este paquete
						</p>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}

export default PackContentsModal
