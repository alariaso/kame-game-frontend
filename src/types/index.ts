// Tipos para las cartas
export interface Card {
	id: string
	name: string
	description: string
	type: CardType
	rarity: CardRarity
	atk?: number
	def?: number
	price: number
	imageUrl: string
	stock: number
}

export type CardType = "monster" | "spell" | "trap"
export type CardRarity = "common" | "rare" | "ultra-rare" | "legendary"

// Tipos para los paquetes
export interface CardPack {
	id: string
	name: string
	description: string
	price: number
	imageUrl: string
	cardCount: number
	stock: number
}

// Tipos para el usuario
export interface UserInventory {
	cards: UserCard[]
	decks: Deck[]
}

export interface UserCard {
	id: string
	cardId: string
	quantity: number
	card: Card
}

export interface Deck {
	id: string
	name: string
	cards: string[] // IDs de cartas
}

// Tipos para batallas
export interface BattleResult {
	winner: "player" | "ai" | "draw"
	playerScore: number
	aiScore: number
	rewards?: Card[]
}

// Estructura para los mazos en batalla
export interface BattleDeck {
	cards: Card[]
	selectedCardIndex: number | null
	playedCardIndices?: number[]
}

// Extendiendo el tipo User para incluir el saldo
export interface User {
	id: string
	username: string
	role: "user" | "admin"
	balance: number // Saldo en Yugi Pesos
}
