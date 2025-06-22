import React, { useState, useContext } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { Menu, X, LogOut, User, ShoppingCart as CartIcon } from "lucide-react"
import UserBalance from "./UserBalance"
import { CartContext } from "@/App"
import logo from "@/../public/logo.png" // Adjust the path if needed

const Navbar: React.FC = () => {
	const { user, isAuthenticated, logout, isAdmin } = useAuth()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const location = useLocation()
	const navigate = useNavigate()
	const cart = useContext(CartContext)

	const isActive = (path: string) => {
		return location.pathname === path
	}

	// Función para redirigir al carrito
	const goToCart = () => {
		navigate("/cart")
	}

	return (
		<header className="w-full py-4 px-6 bg-black/50 backdrop-blur-md border-b border-gold/10 sticky top-0 z-50">
			<div className="container mx-auto flex items-center justify-between">
				<div className="flex items-center flex-shrink-0 mr-4">
					<Link to="/" className="flex items-center gap-2">
						<img
							src={logo}
							alt="Kame Game Logo"
							className="h-10 w-auto"
						/>
						<span className="text-gold font-heading text-xl font-bold whitespace-nowrap">
							Kame Game
						</span>
					</Link>
				</div>

				{/* Mobile menu button */}
				<button
					className="md:hidden text-gold"
					onClick={() => setIsMenuOpen(!isMenuOpen)}
				>
					{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex flex-wrap gap-x-6 gap-y-0 items-center justify-center flex-1 min-w-0 overflow-hidden">
					<Link
						to="/shop"
						className={`font-medium hover:text-gold transition-colors ${isActive("/shop") ? "text-gold" : "text-gray-300"}`}
					>
						Tienda
					</Link>

					{isAuthenticated && (
						<>
							<Link
								to="/inventory"
								className={`font-medium hover:text-gold transition-colors ${isActive("/inventory") ? "text-gold" : "text-gray-300"}`}
							>
								Inventario
							</Link>
							<Link
								to="/battles"
								className={`font-medium hover:text-gold transition-colors ${isActive("/battles") ? "text-gold" : "text-gray-300"}`}
							>
								Batallas
							</Link>
							{isAdmin && (
								<Link
									to="/admin"
									className={`font-medium hover:text-gold transition-colors ${isActive("/admin") ? "text-gold" : "text-gray-300"}`}
								>
									Administración
								</Link>
							)}
						</>
					)}
				</nav>

				{/* Auth buttons, UserBalance and Cart (desktop) */}
				<div className="hidden md:flex items-center gap-4 flex-shrink-0">
					{isAuthenticated && <UserBalance />}

					{/* Shopping Cart - Ahora navega a la página del carrito */}
					{cart && (
						<Button
							variant="outline"
							size="icon"
							className="relative bg-black/40 border-gold/30 hover:bg-gold/10"
							onClick={goToCart}
						>
							<CartIcon className="h-5 w-5 text-gold" />
							{cart.cartItems.length > 0 && (
								<span className="absolute -top-2 -right-2 bg-gold text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
									{cart.cartItems.reduce(
										(acc, item) => acc + item.quantity,
										0
									)}
								</span>
							)}
						</Button>
					)}

					{isAuthenticated ? (
						<div className="flex gap-4 items-center">
							<span className="text-sm text-gray-300">
								Hola, {user!.username}
							</span>
							<Button
								variant="outline"
								className="border-gold/20 hover:bg-gold/10 text-gold"
								onClick={logout}
							>
								<LogOut size={18} className="mr-2" />
								Salir
							</Button>
						</div>
					) : (
						<div className="flex gap-2">
							<Button
								asChild
								variant="ghost"
								className="hover:bg-gold/10 text-gray-300 hover:text-gold"
							>
								<Link to="/login">
									<User size={18} className="mr-2" />
									Iniciar Sesión
								</Link>
							</Button>
							<Button
								asChild
								className="bg-gold hover:bg-gold-dark text-black font-semibold"
							>
								<Link to="/register">Crear Cuenta</Link>
							</Button>
						</div>
					)}
				</div>
			</div>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<div className="md:hidden fixed inset-0 top-[73px] !bg-black backdrop-blur-md p-6 flex flex-col gap-6 z-40">
					<div className="bg-black">
						<div className="flex flex-col gap-4 bg-black">
							<Link
								to="/shop"
								className={`text-lg font-medium hover:text-gold py-2 border-b border-gold/10 ${isActive("/shop") ? "text-gold" : "text-gray-300"}`}
								onClick={() => setIsMenuOpen(false)}
							>
								Tienda
							</Link>

							{isAuthenticated && (
								<>
									<Link
										to="/inventory"
										className={`text-lg font-medium hover:text-gold py-2 border-b border-gold/10 ${isActive("/inventory") ? "text-gold" : "text-gray-300"}`}
										onClick={() => setIsMenuOpen(false)}
									>
										Inventario
									</Link>
									<Link
										to="/battles"
										className={`text-lg font-medium hover:text-gold py-2 border-b border-gold/10 ${isActive("/battles") ? "text-gold" : "text-gray-300"}`}
										onClick={() => setIsMenuOpen(false)}
									>
										Batallas
									</Link>
									{isAdmin && (
										<Link
											to="/admin"
											className={`text-lg font-medium hover:text-gold py-2 border-b border-gold/10 ${isActive("/admin") ? "text-gold" : "text-gray-300"}`}
											onClick={() => setIsMenuOpen(false)}
										>
											Administración
										</Link>
									)}
								</>
							)}
						</div>

						{/* UserBalance, Cart and Auth buttons (mobile) */}
						<div className="mt-auto bg-black">
							<div className="flex items-center justify-between mb-4">
								{isAuthenticated && <UserBalance />}

								{/* Shopping Cart (mobile) - Ahora navega a la página del carrito */}
								{cart && (
									<Button
										variant="outline"
										size="icon"
										className="relative bg-black/40 border-gold/30 hover:bg-gold/10"
										onClick={() => {
											goToCart()
											setIsMenuOpen(false)
										}}
									>
										<CartIcon className="h-5 w-5 text-gold" />
										{cart.cartItems.length > 0 && (
											<span className="absolute -top-2 -right-2 bg-gold text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
												{cart.cartItems.reduce(
													(acc, item) =>
														acc + item.quantity,
													0
												)}
											</span>
										)}
									</Button>
								)}
							</div>

							{isAuthenticated ? (
								<div className="flex flex-col gap-4 mt-4">
									<span className="text-gray-300">
										Conectado como: {user!.username}
									</span>
									<Button
										variant="outline"
										className="border-gold/20 hover:bg-gold/10 text-gold w-full"
										onClick={() => {
											logout()
											setIsMenuOpen(false)
										}}
									>
										<LogOut size={18} className="mr-2" />
										Cerrar Sesión
									</Button>
								</div>
							) : (
								<div className="flex flex-col gap-4">
									<Button
										asChild
										variant="ghost"
										className="hover:bg-gold/10 text-gray-300 hover:text-gold w-full"
										onClick={() => setIsMenuOpen(false)}
									>
										<Link to="/login">
											<User size={18} className="mr-2" />
											Iniciar Sesión
										</Link>
									</Button>
									<Button
										asChild
										className="bg-gold hover:bg-gold-dark text-black font-semibold w-full"
										onClick={() => setIsMenuOpen(false)}
									>
										<Link to="/register">Crear Cuenta</Link>
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</header>
	)
}

export default Navbar
