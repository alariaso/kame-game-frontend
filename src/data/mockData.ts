import type { Card, CardPack, UserInventory } from "@/types"

// Cards mock data
export const MOCK_CARDS: Card[] = [
	{
		id: "1",
		name: "Mago Oscuro",
		description: "El mago definitivo en términos de ataque y defensa.",
		type: "monster",
		rarity: "ultra-rare",
		atk: 2500,
		def: 2100,
		price: 4500,
		imageUrl: "https://ygocards.blob.core.windows.net/cards/10000.jpg",
		stock: 5,
		kind: "WATER",
	},
	{
		id: "2",
		name: "Dragón Blanco de Ojos Azules",
		description:
			"Este dragón legendario es una poderosa máquina de destrucción.",
		type: "monster",
		rarity: "legendary",
		atk: 3000,
		def: 2500,
		price: 6000,
		imageUrl: "https://images.ygoprodeck.com/images/cards/27551.jpg",
		stock: 3,
		kind: "LIGHT",
	},
	{
		id: "3",
		name: "Agujero Oscuro",
		description: "Destruye todos los monstruos en el campo.",
		type: "monster",
		rarity: "rare",
		atk: 2500,
		def: 200,
		price: 2000,
		imageUrl: "https://ygocards.blob.core.windows.net/cards/10000.jpg",
		stock: 10,
		kind: "DARK",
	},
	{
		id: "4",
		name: "Cilindro Mágico",
		description:
			"Niega el ataque de un monstruo y causa daño a tu oponente.",
		type: "monster",
		rarity: "common",
		atk: 2500,
		def: 200,
		price: 1000,
		imageUrl: "https://images.ygoprodeck.com/images/cards/27551.jpg",
		stock: 15,
		kind: "DIVINE",
	},
	{
		id: "5",
		name: "Jinzo",
		description: "Las cartas trampa no pueden ser activadas.",
		type: "monster",
		rarity: "ultra-rare",
		atk: 2400,
		def: 1500,
		price: 3500,
		imageUrl: "https://ygocards.blob.core.windows.net/cards/10000.jpg",
		stock: 7,
		kind: "EARTH",
	},
	{
		id: "6",
		name: "Renace el Monstruo",
		description:
			"Selecciona 1 monstruo en cualquier Cementerio y Invócalo de Modo Especial.",
		type: "monster",
		rarity: "rare",
		atk: 2500,
		price: 1800,
		def: 200,
		imageUrl: "https://images.ygoprodeck.com/images/cards/27551.jpg",
		stock: 12,
		kind: "FIRE",
	},
	{
		id: "7",
		name: "Kuriboh",
		description:
			"Durante el cálculo de daño, si un monstruo del adversario ataca: puedes descartar esta carta; no recibes daño de batalla de ese ataque.",
		type: "monster",
		rarity: "common",
		atk: 300,
		def: 200,
		price: 800,
		imageUrl: "https://ygocards.blob.core.windows.net/cards/10000.jpg",
		stock: 20,
		kind: "WIND",
	},
	{
		id: "8",
		name: "Fuerza de Espejo",
		description:
			"Cuando un monstruo del adversario declara un ataque: destruye todos los monstruos en Posición de Ataque que controle tu adversario.",
		type: "monster",
		rarity: "ultra-rare",
		price: 3000,
		atk: 2500,
		def: 200,
		imageUrl: "https://images.ygoprodeck.com/images/cards/27551.jpg",
		stock: 8,
		kind: "LIGHT",
	},
]

// Card packs mock data
export const MOCK_CARD_PACKS: CardPack[] = [
	{
		id: "1",
		name: "Leyendas Antiguas",
		description:
			"Contiene cartas raras y ultra raras de las primeras épocas del juego.",
		price: 5000,
		imageUrl:
			"https://magicsurvenezuela.com/wp-content/uploads/2020/10/PXL_20201008_185015197-scaled.jpg",
		cardCount: 5,
		stock: 10,
		rarity: "Común",
		cardIds: ["1", "2", "3", "4", "5"],
		discount: 0,
	},
	{
		id: "2",
		name: "Sirvientes del Faraón",
		description:
			"Paquete centrado en cartas con tema egipcio y poderes antiguos.",
		price: 4500,
		imageUrl:
			"https://magicsurvenezuela.com/wp-content/uploads/2020/10/PXL_20201008_185015197-scaled.jpg",
		cardCount: 5,
		stock: 15,
		rarity: "Rara",
		cardIds: ["4", "5", "6", "7", "8"],
		discount: 0,
	},
	{
		id: "3",
		name: "Fuerzas Cibernéticas",
		description: "Cartas de tipo máquina y efectos tecnológicos avanzados.",
		price: 4000,
		imageUrl:
			"https://magicsurvenezuela.com/wp-content/uploads/2020/10/PXL_20201008_185015197-scaled.jpg",
		cardCount: 5,
		stock: 12,
		rarity: "Super Rara",
		cardIds: ["1", "3", "5", "7", "8"],
		discount: 0,
	},
]

// User inventory mock data
export const MOCK_USER_INVENTORY: UserInventory = {
	cards: [
		{
			id: "user-card-1",
			cardId: "1",
			quantity: 2,
			card: MOCK_CARDS[0],
		},
		{
			id: "user-card-2",
			cardId: "2",
			quantity: 1,
			card: MOCK_CARDS[1],
		},
		{
			id: "user-card-3",
			cardId: "3",
			quantity: 1,
			card: MOCK_CARDS[2],
		},
		{
			id: "user-card-4",
			cardId: "4",
			quantity: 3,
			card: MOCK_CARDS[3],
		},
		{
			id: "user-card-5",
			cardId: "5",
			quantity: 1,
			card: MOCK_CARDS[4],
		},
		{
			id: "user-card-6",
			cardId: "6",
			quantity: 1,
			card: MOCK_CARDS[5],
		},
		{
			id: "user-card-7",
			cardId: "7",
			quantity: 2,
			card: MOCK_CARDS[6],
		},
	],
	decks: [
		{
			id: "1",
			name: "Mi primer mazo",
			cards: ["user-card-1", "user-card-3", "user-card-4"],
		},
	],
}
