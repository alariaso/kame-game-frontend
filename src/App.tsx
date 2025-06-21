import { Routes, Route, Navigate, useLocation } from "react-router"
import { Home } from "./pages/Home.tsx"
import { Store } from "./pages/Store.tsx"
import { Login } from "./pages/Login.tsx"
import { Signup } from "./pages/Signup.tsx"
import { Cart } from "./pages/Cart.tsx"
import { Battle } from "./pages/Battle.tsx"
import { Admin } from "./pages/Admin.tsx"
import { Header } from "./components/Header/Header.tsx"
import { Inventory } from "./pages/Inventory.tsx"
import { UserProvider } from "./context/UserProvider.tsx"
import { useUser } from "./context/UserContext.tsx"
import { CartProvider } from "./context/CartProvider.tsx"
import { Toaster } from "@/components/ui/sonner.tsx"
import { useEffect } from "react"

export const App: React.FC = () => {
	const location = useLocation()

	const bgColor =
		location.pathname === "/login" || location.pathname === "/registro"
			? "bg-[#250032]"
			: "bg-[#0D0D0D]"

	// dynamically update the website’s title based on the current route
	// format: Kame Game | <route name>
	useEffect(() => {
		const routeTitleMap: Record<string, string> = {
			"/": "Inicio",
			"/tienda": "Tienda",
			"/inventario": "Inventario",
			"/login": "Iniciar sesión",
			"/registro": "Registro",
			"/carrito": "Carrito",
			"/batalla": "Batalla",
			"/admin": "Administración",
		}

		const pageTitle = routeTitleMap[location.pathname] || "Página"
		document.title = `Kame Game | ${pageTitle}`
	}, [location.pathname])

	return (
		<UserProvider>
			<CartProvider>
				<Header />
				<main className={`${bgColor} min-h-[calc(100vh-100px)]`}>
					{" "}
					{/* header's size fixed? */}
					<Routes>
						<Route index element={<Home />} />
						<Route path="/tienda" element={<Store />} />
						<Route
							path="/inventario"
							element={
								<RequireAuth>
									<Inventory />
								</RequireAuth>
							}
						/>
						<Route path="/login" element={<Login />} />
						<Route path="/registro" element={<Signup />} />
						<Route
							path="/carrito"
							element={
								<RequireAuth>
									<Cart />
								</RequireAuth>
							}
						/>
						<Route
							path="/batalla"
							element={
								<RequireAuth>
									<Battle />
								</RequireAuth>
							}
						/>
						<Route
							path="/admin"
							element={
								<RequireAuth>
									<Admin />
								</RequireAuth>
							}
						/>
					</Routes>
					<Toaster />
				</main>
			</CartProvider>
		</UserProvider>
	)
}

const RequireAuth: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { user, loading } = useUser()
	const location = useLocation()

	if (loading) {
		return <p>Loading...</p>
	}

	if (user === null) {
		return <Navigate to="/login" state={{ prevLocation: location }} />
	}

	return <>{children}</>
}
