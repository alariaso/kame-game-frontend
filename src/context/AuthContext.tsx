import React, { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"
import type { Card, CardPack, UserInventory, UserCard } from "@/types"
import {
	MOCK_CARDS,
	MOCK_CARD_PACKS,
	MOCK_USER_INVENTORY,
} from "@/data/mockData"
import * as apiService from "@/services/api"
import { useNavigate } from "react-router-dom"

// Define los tipos de usuario
type Role = "user" | "admin"

export interface User {
	id: string
	username: string
	role: Role
	balance: number // Saldo en Yugi Pesos
}

// Copia local de las cartas y paquetes para manipular el stock
let availableCards = [...MOCK_CARDS]
let availablePacks = [...MOCK_CARD_PACKS]

interface AuthContextType {
	user: User | null
	userInventory: UserInventory
	isAuthenticated: boolean
	login: (username: string, password: string) => Promise<boolean>
	register: (username: string, password: string) => Promise<boolean>
	logout: () => void
	isAdmin: boolean
	depositBalance: (amount: number) => void
	buyCard: (cardId: string) => boolean
	buyPack: (packId: string) => boolean
	getAvailableCards: () => Card[]
	getAvailablePacks: () => CardPack[]
	refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null)
	const [userInventory, setUserInventory] =
		useState<UserInventory>(MOCK_USER_INVENTORY)
	const [loading, setLoading] = useState(true)

	// Intenta restaurar la sesión desde el token almacenado
	useEffect(() => {
		const initializeAuth = async () => {
			if (apiService.isAuthenticated()) {
				await refreshUserData()
			}
			setLoading(false)
		}

		initializeAuth()
	}, [])

	// Función para refrescar datos del usuario
	const refreshUserData = async () => {
		try {
			const response = await apiService.getUser()

			if (response.status === 200 && response.data) {
				const userData = response.data
				const userObj: User = {
					id: "1", // Se podría obtener del backend
					username: userData.name,
					role: "user", // Se podría obtener del backend
					balance: userData.yugiPesos,
				}
				setUser(userObj)
			} else {
				// Si hay error al obtener usuario, limpiar autenticación
				apiService.clearAuthToken()
				setUser(null)
			}
		} catch (error) {
			console.error("Error refreshing user data:", error)
			apiService.clearAuthToken()
			setUser(null)
		}
	}

	// Validación de nombre de usuario: solo letras, 3-30 caracteres
	const validateUsername = (username: string): boolean => {
		return /^[a-zA-Z]{3,30}$/.test(username)
	}

	// Validación de contraseña: cualquier símbolo UTF-8, 6-50 caracteres
	const validatePassword = (password: string): boolean => {
		return password.length >= 6 && password.length <= 50
	}

	// Función para obtener cartas disponibles (con stock > 0)
	const getAvailableCards = (): Card[] => {
		return availableCards.filter((card) => card.stock > 0)
	}

	// Función para obtener paquetes disponibles (con stock > 0)
	const getAvailablePacks = (): CardPack[] => {
		return availablePacks.filter((pack) => pack.stock > 0)
	}

	// Función para depositar saldo
	const depositBalance = async (amount: number) => {
		if (!user) return

		if (amount <= 0) {
			toast.error("El monto debe ser mayor a 0")
			return
		}

		try {
			const response = await apiService.addFunds(amount);

			if (response.status === 200 && response.data) {
				const updatedUser = {
					...user,
					balance: response.data.yugiPesos
				};
				setUser(updatedUser);
				toast.success(`Has depositado ${amount}`);
			} else {
				toast.error("Error al depositar fondos");
			}
		} catch (error) {
				console.error("Error depositando fondos: ", error);
				toast.error("Error al depositar fondos");
			}
		}

	// Función para comprar una carta
	const buyCard = (cardId: string): boolean => {
		if (!user) {
			toast.error("Debes iniciar sesión para comprar")
			return false
		}

		const cardIndex = availableCards.findIndex((card) => card.id === cardId)
		if (cardIndex === -1 || availableCards[cardIndex].stock <= 0) {
			toast.error("Esta carta no está disponible")
			return false
		}

		const card = availableCards[cardIndex]

		if (user.balance < card.price) {
			toast.error("No tienes suficiente saldo para comprar esta carta")
			return false
		}

		const updatedUser = { ...user, balance: user.balance - card.price }
		setUser(updatedUser)

		const updatedCards = [...availableCards]
		updatedCards[cardIndex] = { ...card, stock: card.stock - 1 }
		availableCards = updatedCards

		const existingCardInInventory = userInventory.cards.find(
			(item) => item.cardId === cardId
		)
		let updatedInventory: UserInventory

		if (existingCardInInventory) {
			const updatedUserCards = userInventory.cards.map((item) =>
				item.cardId === cardId
					? { ...item, quantity: item.quantity + 1 }
					: item
			)
			updatedInventory = { ...userInventory, cards: updatedUserCards }
		} else {
			const newUserCard: UserCard = {
				id: `inv-${Date.now()}`,
				cardId: card.id,
				quantity: 1,
				card: card,
			}
			updatedInventory = {
				...userInventory,
				cards: [...userInventory.cards, newUserCard],
			}
		}

		setUserInventory(updatedInventory)
		toast.success(`Has comprado la carta ${card.name}`)
		return true
	}

	// Función para comprar un paquete
	const buyPack = (packId: string): boolean => {
		if (!user) {
			toast.error("Debes iniciar sesión para comprar")
			return false
		}

		const packIndex = availablePacks.findIndex((pack) => pack.id === packId)
		if (packIndex === -1 || availablePacks[packIndex].stock <= 0) {
			toast.error("Este paquete no está disponible")
			return false
		}

		const pack = availablePacks[packIndex]

		if (user.balance < pack.price) {
			toast.error("No tienes suficiente saldo para comprar este paquete")
			return false
		}

		const updatedUser = { ...user, balance: user.balance - pack.price }
		setUser(updatedUser)

		const updatedPacks = [...availablePacks]
		updatedPacks[packIndex] = { ...pack, stock: pack.stock - 1 }
		availablePacks = updatedPacks

		const randomCards = getRandomCards(pack.cardCount)
		let updatedInventory = { ...userInventory }

		randomCards.forEach((card) => {
			const existingCardInInventory = updatedInventory.cards.find(
				(item) => item.cardId === card.id
			)

			if (existingCardInInventory) {
				updatedInventory.cards = updatedInventory.cards.map((item) =>
					item.cardId === card.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				)
			} else {
				const newUserCard: UserCard = {
					id: `inv-${Date.now()}-${card.id}`,
					cardId: card.id,
					quantity: 1,
					card: card,
				}
				updatedInventory.cards = [
					...updatedInventory.cards,
					newUserCard,
				]
			}
		})

		setUserInventory(updatedInventory)
		toast.success(`Has comprado el paquete ${pack.name}`)
		return true
	}

	// Función auxiliar para obtener cartas aleatorias
	const getRandomCards = (count: number): Card[] => {
		const availableForPacks = [...MOCK_CARDS] // Usar todas las cartas para los paquetes
		const randomCards: Card[] = []

		for (let i = 0; i < count; i++) {
			const randomIndex = Math.floor(
				Math.random() * availableForPacks.length
			)
			randomCards.push(availableForPacks[randomIndex])
		}

		return randomCards
	}

	// Función de login
	const login = async (
		username: string,
		password: string
	): Promise<boolean> => {
		// Validaciones
		if (!validateUsername(username)) {
			toast.error(
				"El nombre de usuario debe contener solo letras y tener entre 3 y 30 caracteres"
			)
			return false
		}

		if (!validatePassword(password)) {
			toast.error("La contraseña debe tener entre 6 y 50 caracteres")
			return false
		}

		try {
			const response = await apiService.login(username, password)

			if (response.status === 200 && response.data?.accessToken) {
				// Obtener datos del usuario después del login exitoso
				await refreshUserData()
				toast.success(`¡Bienvenido, ${username}!`)
				return true
			} else {
				toast.error(response.message || "Credenciales incorrectas")
				return false
			}
		} catch (error) {
			console.error("Login error:", error)
			toast.error("Error al iniciar sesión")
			return false
		}
	}

	// Función de registro
	const register = async (
		username: string,
		password: string
	): Promise<boolean> => {
		// Validaciones
		if (!validateUsername(username)) {
			toast.error(
				"El nombre de usuario debe contener solo letras y tener entre 3 y 30 caracteres"
			)
			return false
		}

		if (!validatePassword(password)) {
			toast.error("La contraseña debe tener entre 6 y 50 caracteres")
			return false
		}

		try {
			const response = await apiService.signUp(username, password)

			if (response.status === 200 || response.status === 201) {
				toast.success("¡Registro exitoso! Iniciando sesión...")
				login(username, password)
				return true
			} else {
				// Manejar mensajes específicos del servidor
				if (response.message === "user already exists") {
					toast.error("Este nombre de usuario ya existe")
				} else {
					toast.error(response.message || "Error en el registro")
				}
				return false
			}
		} catch (error) {
			console.error("Register error:", error)
			toast.error("Error al registrarse")
			return false
		}
	}

	const navigate = useNavigate()

	// Función de logout
	const logout = () => {
		apiService.logout()
		setUser(null)
		navigate("/")
		toast.info("Sesión cerrada")
	}

	// Verificar si el usuario es administrador
	const isAdmin = user?.role === "admin"

	if (loading) {
		return <div>Cargando...</div> // Puedes crear un componente de loading más elaborado
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				userInventory,
				isAuthenticated: !!user,
				login,
				register,
				logout,
				isAdmin,
				depositBalance,
				buyCard,
				buyPack,
				getAvailableCards,
				getAvailablePacks,
				refreshUserData,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}
