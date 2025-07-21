import type { CardKind } from "@/types"

// Configuración base de la API
const API_BASE_URL = "http://localhost:3000"

// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
	error: any
	data: T
	message: string
	status: number
}

export interface LoginResponse {
	accessToken: string
	user?: any
}

export interface UserData {
	name: string
	yugiPesos: number
}

export interface LoginParams {
	name: string
	password: string
}

export interface SignUpParams {
	name: string
	password: string
}

// Funciones para manejo del token
export const setAuthToken = (token: string): void => {
	localStorage.setItem("accessToken", token)
}

export const getAuthToken = (): string | null => {
	return localStorage.getItem("accessToken")
}

export const clearAuthToken = (): void => {
	localStorage.removeItem("accessToken")
}

// Función auxiliar para hacer peticiones HTTP
const makeRequest = async <T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> => {
	const url = `${API_BASE_URL}${endpoint}`

	const defaultHeaders = {
		"Content-Type": "application/json",
		...options.headers,
	}

	try {
		const response = await fetch(url, {
			...options,
			headers: defaultHeaders,
		})

		const data = await response.json()

		return {
			error: data.error || null,
			data: data.data || data,
			message: data.message || "",
			status: response.status,
		}
	} catch (error) {
		console.error("API Request failed:", error)
		return {
			error: true,
			data: null,
			message: "Error de conexión con el servidor",
			status: 0,
		}
	}
}

// Función auxiliar para peticiones autenticadas
const makeAuthenticatedRequest = async <T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> => {
	const token = getAuthToken()

	if (!token) {
		return {
			error: true,
			data: null,
			message: "Token de autenticación no encontrado",
			status: 401,
		}
	}

	const authHeaders = {
		...options.headers,
		Authorization: `Bearer ${token}`,
	}

	return makeRequest<T>(endpoint, {
		...options,
		headers: authHeaders,
	})
}

// 1️⃣ Función de login
export const login = async (
	name: string,
	password: string
): Promise<ApiResponse<LoginResponse>> => {
	const response = await makeRequest<LoginResponse>("/user/login", {
		method: "POST",
		body: JSON.stringify({ name, password }),
	})

	// Si el login es exitoso, guardar el token
	if (response.status === 200 && response.data?.accessToken) {
		setAuthToken(response.data.accessToken)
	}

	return response
}

// 2️⃣ Función de registro
export const signUp = async (
	name: string,
	password: string
): Promise<ApiResponse<any>> => {
	return makeRequest("/user/signup", {
		method: "POST",
		body: JSON.stringify({ name, password }),
	})
}

// 3️⃣ Función para obtener datos del usuario
export const getUser = async (): Promise<ApiResponse<UserData>> => {
	return makeAuthenticatedRequest<UserData>("/user")
}

// Función de logout
export const logout = async (): Promise<void> => {
	clearAuthToken()
	// Aquí se podría agregar una llamada al backend para invalidar el token si fuera necesario
}

// Función para verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
	return getAuthToken() !== null
}

// Funcion para anadir los yugiPesos jeje
export const addFunds = async (
	amount: number
): Promise<ApiResponse<UserData>> => {
	return makeAuthenticatedRequest<UserData>("/user/funds", {
		method: "PATCH",
		body: JSON.stringify({ amount: amount }),
	})
}

// Tipos para las nuevas funciones
export interface CardData {
	name: string
	price: number
	imageUrl: string
	attribute: string
	attack: number
}

// Tipos para las nuevas funciones
export interface Pack {
	name: string
	price: number
	imageUrl: string
	rarity: "COMMON" | "RARE" | "SUPER RARE" | "ULTRA RARE"
	discount?: number // Descuento opcional
}

export interface GetCardsResponse {
	results: any[]
	totalPages: number
}

// same type xD
export interface GetInventoryResponse {
	name: string
	results: any[]
	totalPages: number
}

// 4️⃣ Función para crear carta
export const createCard = async (
	cardData: CardData
): Promise<ApiResponse<any>> => {
	return makeAuthenticatedRequest("/cards/", {
		method: "POST",
		body: JSON.stringify(cardData),
	})
}

// one card
export const getCard = async (id: string): Promise<ApiResponse<any>> => {
	return makeRequest(`/cards/${id}`);
}

// 5️⃣ Función para obtener cartas con paginación
export const getCards = async (
	page: number = 1,
	itemsPerPage: number = 10
): Promise<ApiResponse<GetCardsResponse>> => {
	const queryParams = new URLSearchParams({
		page: page.toString(),
		itemsPerPage: itemsPerPage.toString(),
	})

	return makeAuthenticatedRequest<GetCardsResponse>(
		`/cards?${queryParams.toString()}`
	)
}

// 6️⃣ Función para vaciar todo el carrito
export const clearCart = async (): Promise<ApiResponse<any>> => {
	return makeAuthenticatedRequest("/cart", {
		method: "DELETE",
	})
}

// 7️⃣ Función para eliminar un ítem específico del carrito
export const removeCartItem = async (
	cardId: number
): Promise<ApiResponse<any>> => {
	return makeAuthenticatedRequest(`/cart/card/${cardId}`, {
		method: "DELETE",
	})
}

// 8️⃣ Función para actualizar cantidad de cartas (Admin)
export const updateCardStock = async (
	cardId: number,
	quantity: number
): Promise<ApiResponse<any>> => {
	return makeAuthenticatedRequest(`/cards/${cardId}`, {
		method: "PATCH",
		body: JSON.stringify({ stock: quantity }),
	})
}

export const updateCardPrice = async (
	cardId: number,
	price: number
): Promise<ApiResponse<any>> => {
	return makeAuthenticatedRequest(`/cards/${cardId}`, {
		method: "PATCH",
		body: JSON.stringify({ price: price }),
	})
}

// 9️⃣ Función para agregar un solo elemento al carrito
export const addToCart = async (cardId: number): Promise<ApiResponse<any>> => {
	return makeAuthenticatedRequest("/cart", {
		method: "POST",
		body: JSON.stringify({ cardId: cardId }),
	})
}

// 🔟 Función para agregar varios elementos al carrito
export const addMultipleToCart = async (
	items: { cardId: number; quantity: number }[]
): Promise<ApiResponse<any>> => {
	return makeAuthenticatedRequest("/cart", {
		method: "POST",
		body: JSON.stringify({ items }),
	})
}

// 1️⃣1️⃣ Función para obtener el contenido del carrito
export const getCart = async (): Promise<ApiResponse<any>> => {
	return makeAuthenticatedRequest("/cart")
}

// buy cart
export const buyCart = async (): Promise<ApiResponse<any>> => {
	return makeAuthenticatedRequest("/cart/buy");
}

export const addCartToPack = async (
	PackId: number,
	CardsId: number[]
): Promise<ApiResponse<any>> => {
	return makeAuthenticatedRequest(`/packs/${PackId}/cards`, {
		method: "POST",
		body: JSON.stringify({ cards: CardsId }),
	})
}

export const createPack = async (packData: Pack): Promise<ApiResponse<any>> => {
	return makeAuthenticatedRequest("/packs/", {
		method: "POST",
		body: JSON.stringify(packData),
	})
}

//  Función para obtener cartas con paginación
export const getCPacks = async (
	page: number = 1,
	itemsPerPage: number = 10
): Promise<ApiResponse<GetCardsResponse>> => {
	const queryParams = new URLSearchParams({
		page: page.toString(),
		itemsPerPage: itemsPerPage.toString(),
	})

	return makeAuthenticatedRequest<GetCardsResponse>(
		`/packs?${queryParams.toString()}`
	)
}

export const getCardsOfPack = async (
	idPack: number
): Promise<ApiResponse<GetCardsResponse>> => {
	return makeAuthenticatedRequest<GetCardsResponse>(`/packs/${idPack}/cards`)
}

// get inventory function
export const getInventory = async (
	page: number = 1,
	itemsPerPage: number = 10,
	itemName?: string,
	cardAttribute?: CardKind
): Promise<ApiResponse<GetInventoryResponse>> => {
	const queryParams = new URLSearchParams({
		page: page.toString(),
		itemsPerPage: itemsPerPage.toString(),
	})

	if (itemName) {
		queryParams.append("itemName", itemName)
	}
	if (cardAttribute) {
		queryParams.append("cardAttribute", cardAttribute)
	}

	return makeAuthenticatedRequest(`/inventory?${queryParams.toString()}`)
}

// 1️⃣2️⃣ Función para procesar la compra del carrito
export const buyCart = async (): Promise<ApiResponse<any>> => {
	return makeAuthenticatedRequest("/cart/buy", {
		method: "GET",
	})
}

// get random cards
export const getRandomCards = async (num?: number): Promise<ApiResponse<{results: any[]}>> => {
	if (num) {
		const queryParams = new URLSearchParams({
			num: num.toString()
		});
		return makeRequest(`/cards/random?${queryParams.toString()}`)
	}
	return makeRequest(`/cards/random`)
}
