const Footer = () => {
	return (
		<footer className="bg-black/40 text-gold py-4 text-center text-sm space-y-1">
			<div>
				Made with <span className="text-red-500 animate-pulse">♥</span>{" "}
				by the Kame Game Team
			</div>
			<div className="space-x-4">
				<span>&copy; {new Date().getFullYear()}</span>
				<a
					href="https://github.com/alariaso/kame-game-frontend"
					target="_blank"
					rel="noreferrer noopener"
					className="hover:underline"
				>
					GitHub
				</a>
				<a
					href="https://github.com/alariaso/kame-game-frontend/blob/main/README.md"
					className="hover:underline"
				>
					About
				</a>
			</div>
		</footer>
	)
}

export default Footer
