import React from "react"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Swords, Trophy, Shield } from "lucide-react"

interface BattleResultProps {
	result: {
		winner: "player" | "ai" | "draw" | null
		playerScore: number
		aiScore: number
	}
	onNewBattle: () => void
}

const BattleResult: React.FC<BattleResultProps> = ({ result, onNewBattle }) => {
	return (
		<div className="max-w-3xl mx-auto">
			<Card className="bg-black/40 backdrop-blur-md border-gold/20">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl text-gold">
						Resultado del Duelo
					</CardTitle>
					<CardDescription>
						La batalla ha terminado. ¡Descubre el resultado final!
					</CardDescription>
				</CardHeader>

				<CardContent>
					<div className="flex flex-col md:flex-row items-center justify-center gap-8 py-6">
						<div className="text-center">
							<h3 className="text-lg font-medium mb-2">
								Tu Puntuación
							</h3>
							<p className="text-4xl font-bold text-gold">
								{result.playerScore}
							</p>
						</div>

						<div className="my-4 md:my-0 flex flex-col items-center">
							{result.winner === "player" && (
								<Trophy size={48} className="text-gold mb-2" />
							)}
							{result.winner === "ai" && (
								<Swords
									size={48}
									className="text-red-400 mb-2"
								/>
							)}
							{result.winner === "draw" && (
								<Shield
									size={48}
									className="text-blue-400 mb-2"
								/>
							)}

							<div className="text-2xl font-bold">
								{result.winner === "player" && (
									<span className="text-green-500">
										¡Victoria!
									</span>
								)}
								{result.winner === "ai" && (
									<span className="text-red-500">
										¡Derrota!
									</span>
								)}
								{result.winner === "draw" && (
									<span className="text-blue-500">
										¡Empate!
									</span>
								)}
							</div>
						</div>

						<div className="text-center">
							<h3 className="text-lg font-medium mb-2">
								Puntuación Rival
							</h3>
							<p className="text-4xl font-bold text-gold/60">
								{result.aiScore}
							</p>
						</div>
					</div>

					{result.winner === "player" && (
						<div className="mt-6 p-4 border border-gold/20 rounded-lg bg-gold/5">
							<div className="flex items-center gap-2 mb-2">
								<Trophy size={20} className="text-gold" />
								<h3 className="text-lg font-medium text-gold">
									¡Recompensas Obtenidas!
								</h3>
							</div>
							<p className="text-gray-300">
								Has ganado 100 monedas y puntos de experiencia
							</p>
						</div>
					)}
				</CardContent>

				<CardFooter className="flex justify-center">
					<Button
						className="bg-gold hover:bg-gold-dark text-black font-semibold"
						onClick={onNewBattle}
					>
						<Swords className="mr-2" size={18} />
						Iniciar Nuevo Duelo
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}

export default BattleResult
