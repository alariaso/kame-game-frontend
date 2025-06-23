import React from "react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { ShoppingCart, BookOpen, Swords } from "lucide-react"

const Home: React.FC = () => {
	const { isAuthenticated } = useAuth()

	return (
		<div className="min-h-[calc(100vh-73px)] flex flex-col">
			{/* Hero Section */}
			<section className="relative py-20 px-6 flex flex-col items-center justify-center bg-[#250032] text-center">
				<div className="container max-w-4xl mx-auto relative z-10">
				<h1 className="text-4xl md:text-6xl font-bold mb-6 text-gold">
					Kame Game
					</h1>
					<p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
						Tu tienda virtual de cartas donde puedes comprar, coleccionar y batallar.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						{isAuthenticated ? (
							<>
								<Button
									asChild
									size="lg"
									className="bg-gold hover:bg-gold-dark text-black font-semibold"
								>
									<Link to="/shop">
										<ShoppingCart
											className="mr-2"
											size={20}
										/>
										Visitar Tienda
									</Link>
								</Button>
								<Button
									asChild
									size="lg"
									variant="outline"
									className="border-gold/20 hover:bg-gold/10 text-gold"
								>
									<Link to="/battles">
										<Swords className="mr-2" size={20} />
										Ir a Batallas
									</Link>
								</Button>
							</>
						) : (
							<>
								<Button
									asChild
									size="lg"
									className="bg-gold hover:bg-gold-dark text-black font-semibold"
								>
									<Link to="/register">Crear Cuenta</Link>
								</Button>
								<Button
									asChild
									size="lg"
									variant="outline"
									className="border-gold/20 hover:bg-gold/10 text-gold"
								>
									<Link to="/login">Acceder</Link>
								</Button>
							</>
						)}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16 px-6 bg-black/20">
				<div className="container mx-auto">
					<h2 className="text-3xl font-bold mb-12 text-center text-gold">
						Descubre el poder de las cartas
					</h2>

					<div className="grid md:grid-cols-3 gap-8">
						<div className="bg-gradient-to-b from-black/40 to-black/60 p-6 rounded-lg border border-gold/10 transform transition-all hover:border-gold/30 card-hover">
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center text-gold">
								<ShoppingCart size={28} />
							</div>
							<h3 className="text-xl font-semibold mb-3 text-center">
								Amplia Colección
							</h3>
							<p className="text-gray-400 text-center">
								Descubre una extensa selección de cartas raras y
								paquetes exclusivos para potenciar tu mazo.
							</p>
						</div>

						<div className="bg-gradient-to-b from-black/40 to-black/60 p-6 rounded-lg border border-gold/10 transform transition-all hover:border-gold/30 card-hover">
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center text-gold">
								<BookOpen size={28} />
							</div>
							<h3 className="text-xl font-semibold mb-3 text-center">
								Gestión de Mazos
							</h3>
							<p className="text-gray-400 text-center">
								Organiza tus cartas y crea estrategias
								imbatibles con nuestro sistema de gestión de
								mazos.
							</p>
						</div>

						<div className="bg-gradient-to-b from-black/40 to-black/60 p-6 rounded-lg border border-gold/10 transform transition-all hover:border-gold/30 card-hover">
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center text-gold">
								<Swords size={28} />
							</div>
							<h3 className="text-xl font-semibold mb-3 text-center">
								Duelos Místicos
							</h3>
							<p className="text-gray-400 text-center">
								Enfrenta a los trabajadores del Mercado Místico
								y prueba tus habilidades en intensos duelos.
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}

export default Home
