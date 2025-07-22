import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
// import { MOCK_CARDS, MOCK_USER_INVENTORY } from "@/data/mockData"
import { toast } from "sonner"
import { Swords } from "lucide-react"
import type { UserDeck, AiDeck, Card as CardType, UserCard, CardKind } from "@/types"
import BattleCardSelection from "@/components/battles/BattleCardSelection"
import BattleArena from "@/components/battles/BattleArena"
import BattleResult from "@/components/battles/BattleResults"
import { getInventory, getRandomCards } from "@/services/api"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

const Battles: React.FC = () => {
	// Battle stages
	const STAGES = {
		SELECTION: "selection",
		PREPARE: "prepare",
		ROUND: "round",
		RESULT: "result",
	}

	const [stage, setStage] = useState(STAGES.SELECTION)
	const [selectedCards, setSelectedCards] = useState<string[]>([])
	const [battleResult, setBattleResult] = useState<{
		winner: "player" | "ai" | "draw" | null
		playerScore: number
		aiScore: number
	} | null>(null)

	const [battleInProgress, setBattleInProgress] = useState(false)

	// Battle-specific states
	const [playerDeck, setPlayerDeck] = useState<UserDeck | null>(null)
	const [aiDeck, setAiDeck] = useState<AiDeck | null>(null)
	const [currentRound, setCurrentRound] = useState(0)
	const [roundsWon, setRoundsWon] = useState({ player: 0, ai: 0 })
	const [roundResult, setRoundResult] = useState<{
		playerCard: UserCard | null
		aiCard: CardType | null
		winner: "player" | "ai" | "draw" | null
		reason: string
	} | null>(null)

	// Store last played cards for tiebreaker
	const [lastPlayedCards, setLastPlayedCards] = useState<{
		playerCard: UserCard | null
		aiCard: CardType | null
	}>({ playerCard: null, aiCard: null })

	// const userCards = MOCK_USER_INVENTORY.cards

	const [userCards, setUserCards] = useState<UserCard[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [filter, setFilter] = useState<CardKind | null>(null);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [currentPage, setCurrentPage] = useState<number>(1);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page)
		}
	}
	
	useEffect(() => {
		const loadInventory = async () => {
			setLoading(true);

			try {
				const response = await getInventory(
					currentPage,
					10,
					searchTerm || undefined,
					filter || undefined
				)

				if (response.error) {
					console.error("Error loading inventory:", response.message);
					toast.error("Error al cargar el inventario: " + response.message);
					setUserCards([]);
					setTotalPages(1);
				} else {
					// Usar los datos reales de la API
					setUserCards(response.data?.results || []);
					setTotalPages(response.data?.totalPages || 1);
				}
			} catch (err) {
				console.error("Error loading inventory: ", err);
				toast.error("Error de conexión al cargar el inventario");
				setUserCards([]);
				setTotalPages(1);
			}

			setLoading(false);
		}

		loadInventory();
	}, [searchTerm, filter, currentPage]);

	// Function to determine winner based on exact attribute matchups
	const determineWinner = (playerCard: UserCard, aiCard: CardType): { winner: "player" | "ai" | "draw", reason: string } => {
		const playerKind = playerCard.attribute
		const aiKind = aiCard.attribute

		// If same attribute, it's a draw
		if (playerKind === aiKind) {
			return { winner: "draw", reason: `Ambas cartas tienen el mismo atributo (${playerKind})` }
		}

		// Define exact winning matchups based on the provided list
		const winningMatchups: Record<string, string[]> = {
			'DIVINE': ['DARK', 'EARTH', 'FIRE', 'LIGHT', 'WATER', 'WIND'], // DIVINE wins against everything
			'DARK': ['EARTH', 'FIRE', 'WATER', 'WIND'], // DARK loses to DIVINE and LIGHT
			'LIGHT': ['DARK', 'EARTH', 'FIRE', 'WATER', 'WIND'], // LIGHT loses to DIVINE only
			'EARTH': ['FIRE'], // EARTH loses to DARK, DIVINE, LIGHT, WATER, WIND
			'FIRE': ['WIND'], // FIRE loses to DARK, DIVINE, EARTH, LIGHT, WATER
			'WATER': ['FIRE', 'WIND'], // WATER loses to DARK, DIVINE, EARTH, LIGHT
			'WIND': ['EARTH'] // WIND loses to DARK, DIVINE, FIRE, LIGHT, WATER
		}

		// Check if player wins
		if (winningMatchups[playerKind]?.includes(aiKind)) {
			return { winner: "player", reason: `${playerKind} vence a ${aiKind}` }
		}

		// Check if AI wins
		if (winningMatchups[aiKind]?.includes(playerKind)) {
			return { winner: "ai", reason: `${aiKind} vence a ${playerKind}` }
		}

		// If no matchup is defined, it's a draw
		return { winner: "draw", reason: `No hay relación definida entre ${playerKind} y ${aiKind}` }
	}

	// Prepare player deck from selected cards
	const prepareBattle = async () => {
		// Get user's selected cards
		const playerCards = selectedCards
			.map((id) => {
				const userCard = userCards.find((uc) => uc.id === id)
				return userCard ? userCard : null
			})
			.filter(Boolean) as UserCard[]

		setPlayerDeck({
			cards: playerCards,
			selectedCardIndex: null,
		})

		// Select 5 random cards for AI
		try {
			const response = await getRandomCards(5);
			if (response.error) {
				console.error("error loading ai cards");
				toast.error("Error loading the game");
				return;
			}


			setAiDeck({
				cards: response.data.results,
				selectedCardIndex: null,
			})
			
			setStage(STAGES.PREPARE);
			toast.success("¡Cartas seleccionadas! Prepárate para el duelo.");
		} catch (err) {
			console.error("error loading the ai cards", err);
			toast.error("Error loading the game");
		}


	}

	// Start a new round
	const startRound = () => {
		if (!playerDeck || !aiDeck) return

		setStage(STAGES.ROUND)
		setCurrentRound((prev) => prev + 1)
		setRoundResult(null)

		// AI randomly selects a card
		const availableAiCards = aiDeck.cards.filter(
			(_, index) => !aiDeck.playedCardIndices?.includes(index)
		)
		const randomAiIndex = Math.floor(
			Math.random() * availableAiCards.length
		)
		const aiCardIndex = aiDeck.cards.findIndex(
			(card) => card.id === availableAiCards[randomAiIndex].id
		)

		setAiDeck({
			...aiDeck,
			selectedCardIndex: aiCardIndex,
		})
	}

	// Player selects a card for battle
	const selectCardForBattle = (index: number) => {
		if (!playerDeck) return

		setPlayerDeck({
			...playerDeck,
			selectedCardIndex: index,
		})
	}

	// Resolve the current round
	const resolveRound = () => {
		if (
			!playerDeck ||
			!aiDeck ||
			playerDeck.selectedCardIndex === null ||
			aiDeck.selectedCardIndex === null
		) {
			return
		}

		const playerCard = playerDeck.cards[playerDeck.selectedCardIndex]
		const aiCard = aiDeck.cards[aiDeck.selectedCardIndex]

		// Store last played cards for potential tiebreaker
		setLastPlayedCards({ playerCard, aiCard })

		// Determine winner using exact attribute logic
		const { winner, reason } = determineWinner(playerCard, aiCard)

		// Calculate new rounds won using current values
		const newPlayerScore = winner === "player" ? roundsWon.player + 1 : roundsWon.player
		const newAiScore = winner === "ai" ? roundsWon.ai + 1 : roundsWon.ai

		// Update rounds won with calculated values
		const newRoundsWon = { player: newPlayerScore, ai: newAiScore }
		setRoundsWon(newRoundsWon)

		// Set round result
		setRoundResult({
			playerCard,
			aiCard,
			winner,
			reason,
		})

		// Mark cards as played
		setPlayerDeck({
			...playerDeck,
			playedCardIndices: [
				...(playerDeck.playedCardIndices || []),
				playerDeck.selectedCardIndex,
			],
			selectedCardIndex: null,
		})

		setAiDeck({
			...aiDeck,
			playedCardIndices: [
				...(aiDeck.playedCardIndices || []),
				aiDeck.selectedCardIndex,
			],
			selectedCardIndex: null,
		})

		// Check if there's a battle winner using calculated values
		if (newPlayerScore >= 3) {
			setBattleResult({
				winner: "player",
				playerScore: newPlayerScore,
				aiScore: newAiScore,
			})
			setStage(STAGES.RESULT)
			toast.success("¡Has ganado la batalla!")
		} else if (newAiScore >= 3) {
			setBattleResult({
				winner: "ai",
				playerScore: newPlayerScore,
				aiScore: newAiScore,
			})
			setStage(STAGES.RESULT)
			toast.error("Has perdido esta vez. ¡Inténtalo de nuevo!")
		} else if (currentRound >= 5) {
			// If we've played 5 rounds, determine winner using calculated values
			let finalWinner: "player" | "ai" | "draw"
			
			if (newPlayerScore > newAiScore) {
				finalWinner = "player"
			} else if (newPlayerScore < newAiScore) {
				finalWinner = "ai"
			} else {
				// Tiebreaker: compare attack of last played cards
				const playerAtk = playerCard.attack || 0
				const aiAtk = aiCard.attack || 0
				
				if (playerAtk > aiAtk) {
					finalWinner = "player"
				} else if (playerAtk < aiAtk) {
					finalWinner = "ai"
				} else {
					finalWinner = "draw"
				}
			}

			setBattleResult({
				winner: finalWinner,
				playerScore: newPlayerScore,
				aiScore: newAiScore,
			})
			setStage(STAGES.RESULT)

			if (finalWinner === "player") {
				toast.success("¡Has ganado la batalla!")
			} else if (finalWinner === "ai") {
				toast.error("Has perdido esta vez. ¡Inténtalo de nuevo!")
			} else {
				toast.info("La batalla ha terminado en empate.")
			}
		}
	}

	// Reset all battle states
	const resetBattle = () => {
		setBattleResult(null)
		setSelectedCards([])
		setPlayerDeck(null)
		setAiDeck(null)
		setCurrentRound(0)
		setRoundsWon({ player: 0, ai: 0 })
		setRoundResult(null)
		setLastPlayedCards({ playerCard: null, aiCard: null })
		setStage(STAGES.SELECTION)
	}

	return (
		<div className="min-h-[calc(100vh-73px)] py-8 px-6">
			<div className="container mx-auto">
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold text-gold mb-2">
						Arena de Duelos
					</h1>
					<p className="text-gray-400 max-w-2xl mx-auto">
						Demuestra tu valía en la arena enfrentándote a los
						trabajadores místicos del Mercado.
					</p>
				</div>

				{/* Card Selection Stage */}
				<>
				{stage === STAGES.SELECTION && (
					<BattleCardSelection
						userCards={userCards}
						selectedCards={selectedCards}
						setSelectedCards={setSelectedCards}
						onConfirm={prepareBattle}
					/>
				)
				}
				{loading ? (
				<div className="text-center py-12">
					<p className="text-gray-400">Cargando inventario...</p>
				</div>
			) : userCards.length > 0 ? (
				<>
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
				</>

				{/* Prepare Stage - Show both decks and start button */}
				{stage === STAGES.PREPARE && playerDeck && aiDeck && (
					<div className="max-w-4xl mx-auto">
						<Card className="bg-black/40 backdrop-blur-sm border-gold/20">
							<CardHeader>
								<CardTitle className="text-2xl text-gold text-center">
									Preparación del Duelo
								</CardTitle>
								<CardDescription className="text-center">
									¡Las cartas han sido seleccionadas!
									Prepárate para enfrentarte al rival.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col md:flex-row items-center justify-between gap-6">
									<div className="text-center">
										<h3 className="text-lg font-medium mb-3 text-gold">
											Tu Mazo
										</h3>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
											{playerDeck.cards.map((card, i) => (
												<img
													key={i}
													src={card.imageUrl}
													alt={card.name}
													className="w-20 h-28 object-cover rounded border border-gold/30"
												/>
											))}
										</div>
									</div>

									<Swords
										size={40}
										className="text-gold my-4"
									/>

									<div className="text-center">
										<h3 className="text-lg font-medium mb-3 text-gold">
											Mazo Rival
										</h3>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
											{aiDeck.cards.map((_, i) => (
												<div
													key={i}
													className="w-20 h-28 bg-gradient-to-b from-purple-900/60 to-black/80 rounded border border-gold/30 flex items-center justify-center"
												>
													<span className="text-gold text-2xl">
														?
													</span>
												</div>
											))}
										</div>
									</div>
								</div>
							</CardContent>
							<CardFooter className="justify-center">
								<Button
									className="bg-gold hover:bg-gold-dark text-black font-semibold"
									onClick={startRound}
								>
									<Swords className="mr-2" size={18} />
									Iniciar Primera Ronda
								</Button>
							</CardFooter>
						</Card>
					</div>
				)}

				{/* Round Stage - Battle Arena */}
				{stage === STAGES.ROUND && playerDeck && aiDeck && (
					<BattleArena
						playerDeck={playerDeck}
						aiDeck={aiDeck}
						currentRound={currentRound}
						roundsWon={roundsWon}
						roundResult={roundResult}
						onSelectCard={selectCardForBattle}
						onConfirmSelection={resolveRound}
						onNextRound={startRound}
					/>
				)}

				{/* Result Stage */}
				{stage === STAGES.RESULT && battleResult && (
					<BattleResult
						result={battleResult}
						onNewBattle={resetBattle}
					/>
				)}

				{/* Reglas del duelo */}
				<div className="mt-12 max-w-3xl mx-auto">
					<Card className="bg-black/20 border-gold/10">
						<CardHeader>
							<CardTitle className="text-gold">
								Reglas del Duelo
							</CardTitle>
						</CardHeader>
						<CardContent className="text-sm text-gray-400 space-y-2">
							<p>
								• Selecciona 5 cartas para formar tu mano de
								duelo.
							</p>
							<p>
								• El rival seleccionará automáticamente 5
								cartas.
							</p>
							<p>
								• En cada ronda, ambos jugadores eligen una
								carta para combatir.
							</p>
							<p>
								• Jerarquía de atributos: DIVINE vence a todos, DARK y LIGHT son fuertes, otros tienen relaciones específicas.
							</p>
							<p>
								• Si los atributos son iguales o no hay relación, la ronda termina en empate.
							</p>
							<p>
								• Gana el duelo quien obtenga 3 victorias en rondas.
							</p>
							<p>
								• En caso de empate tras 5 rondas, se desempata por ataque de la última carta jugada.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}

export default Battles
