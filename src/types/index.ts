// Tipos para las cartas
export interface Card {
	id: string
	name: string
	// description: string not in db
	// type: CardType not in db
	// rarity: CardRarity not in db
	attack: number
	// def?: number
	price: number
	imageUrl: string
	stock: number
	attribute: CardKind // attribute
}

// export type CardType = "monster" | "spell" | "trap" only monsters
// export type CardRarity = "common" | "rare" | "ultra-rare" | "legendary" not
export type CardKind =
	| "DARK"
	| "DIVINE"
	| "EARTH"
	| "FIRE"
	| "LIGHT"
	| "WATER"
	| "WIND"

export type PackRarity = "COMMON" | "RARE" | "SUPER RARE" | "ULTRA RARE"

// Tipos para los paquetes
export interface CardPack {
	id: string
	name: string
	description: string
	price: number
	imageUrl: string
	cardCount: number
	stock: number
	rarity: string
	cardIds: string[]
	discount: number
}

export interface Pack {
	id: string
	name: string
	price: number
	imageUrl: string
	rarity: PackRarity
	discount?: number // Descuento opcional
	stock: number
	description: string
}

// Tipos para el usuario
export interface UserInventory {
	cards: UserCard[]
	// decks: Deck[] not
}

export interface UserCard {
	id: string
	cardId: string
	name: string
	attack: number
	imageUrl: string
	attribute: CardKind // attribute
	quantity: number
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
export interface UserDeck {
	cards: UserCard[]
	selectedCardIndex: number | null
	playedCardIndices?: number[]
}
export interface AiDeck {
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
