import cards from "./assets/some-cards.json"

export type User = {
	username: string
	isAdmin: boolean
	yugiPesos: number
}

export type Product = Card | Pack

export type CardKind =
	| "DARK"
	| "DIVINE"
	| "EARTH"
	| "FIRE"
	| "LIGHT"
	| "WATER"
	| "WIND"

export type Card = {
	category: "card"
	id: number
	name: string
	price: number
	image_url: string
	kind: CardKind
	stock: number
	attack: number
}

export type PackRarity = "COMMON" | "RARE" | "SUPER RARE" | "ULTRA RARE"

export type Pack = {
	category: "pack"
	id: number
	name: string
	price: number
	image_url: string
	rarity: PackRarity
}

export type LoginParams = {
	username: string
	password: string
}

// POST /login
export const login = async (params: LoginParams): Promise<User> => {
	const user = {
		username: params.username,
		isAdmin: false,
		yugiPesos: 10000,
	}
	return user
}

// GET /logout
export const logout = async (): Promise<void> => {}

export type SignupParams = {
	username: string
	password: string
}

export const signup = async (params: SignupParams): Promise<User> => {
	const user = {
		username: params.username,
		isAdmin: false,
		yugiPesos: 10000,
	}
	return user
}

export type UpdateParams = {
	username: string
	isAdmin: boolean
	yugiPesos: number
}

// PUT /update
export const update = async (params: UpdateParams): Promise<User> => {
	await sleep(1)
	const updatedUser = {
		username: params.username,
		isAdmin: params.isAdmin,
		yugiPesos: params.yugiPesos,
	}

	return updatedUser
}

const sleep = (seconds: number): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

export type SearchParams = {
	page: number
	itemsPerPage: number
	itemName?: string | null
}

export type SearchResponse<T> = {
	totalPages: number
	items: T[]
}

export type GetCardsParams = SearchParams & {
	cardKind?: CardKind // TODO agregar en el enunciado que se puede filtrar por tipo de carta
}

// GET /cards
export const getCards = async (
	params: GetCardsParams
): Promise<SearchResponse<Card>> => {
	await sleep(2) // simulate api call time
	let filteredCards = cards
	if (params.itemName) {
		const name = params.itemName.toLowerCase()
		filteredCards = cards.filter((card) =>
			card.name.toLowerCase().includes(name)
		)
	}
	const items = filteredCards
		.slice(
			params.itemsPerPage * (params.page - 1),
			params.itemsPerPage * params.page
		)
		.map((card) => ({ ...card, category: "card" })) as Card[]
	return {
		totalPages: Math.ceil(filteredCards.length / params.itemsPerPage),
		items,
	}
}

export type GetPacksParams = SearchParams & {
	packRarity?: PackRarity // TODO agregar en el enunciado que se puede filtrar por rareza de producto
}

// GET /packs
export const getPacks = async (
	params: GetPacksParams
): Promise<SearchResponse<Pack>> => {
	await sleep(2)
	console.log(params) // para que eslint no se queje de no estar utilizando `params`
	return { totalPages: 0, items: [] }
}

export type InventoryCard = Omit<Card, "category"> & {
	category: "inventoryCard"
	amount: number
}

export type GetInventoryParams = GetCardsParams

// GET /inventory
export const getInventory = async (
	params: GetInventoryParams
): Promise<SearchResponse<InventoryCard>> => {
	await sleep(2)
	const c = cards.slice(11, 34).map((a) => ({ ...a, amount: 1 }))
	let filteredCards = c
	if (params.itemName) {
		const name = params.itemName.toLowerCase()
		filteredCards = c.filter((card) =>
			card.name.toLowerCase().includes(name)
		)
	}
	const items = filteredCards
		.slice(
			params.itemsPerPage * (params.page - 1),
			params.itemsPerPage * params.page
		)
		.map((card) => ({
			...card,
			category: "inventoryCard",
		})) as InventoryCard[]
	return {
		totalPages: Math.ceil(filteredCards.length / params.itemsPerPage),
		items,
	}
}

// GET /cart
export const getCartIDs = async (): Promise<number[]> => {
	await sleep(3)
	const cartJSON = localStorage.getItem("cart")
	if (cartJSON) {
		return JSON.parse(cartJSON)
	}
	return []
}

export type AddToCartParams = {
	productId: number
}

// POST /cart/add
export const addToCart = async (params: AddToCartParams): Promise<void> => {
	await sleep(2)
	const cartJSON = localStorage.getItem("cart")
	let cart = []
	if (cartJSON !== null) {
		cart = JSON.parse(cartJSON)
	}
	cart.push(params.productId)
	localStorage.setItem("cart", JSON.stringify(cart))
}

export type RemoveFromCartParams = {
	productId: number
}

// POST /cart/remove
export const removeFromCart = async (
	params: RemoveFromCartParams
): Promise<void> => {
	await sleep(2)
	const cartJSON = localStorage.getItem("cart")
	let cart = []
	if (cartJSON !== null) {
		cart = JSON.parse(cartJSON)
	}

	const idx = cart.indexOf(params.productId)
	if (idx == -1) {
		return
	}
	cart.splice(idx, 1)
	localStorage.setItem("cart", JSON.stringify(cart))
}
