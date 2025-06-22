import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"

const formSchema = z.object({
	name: z
		.string()
		.min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
	description: z
		.string()
		.min(10, {
			message: "La descripción debe tener al menos 10 caracteres",
		}),
	price: z.string().min(1, { message: "El precio es requerido" }),
	imageUrl: z.string().url({ message: "Debe ser una URL válida" }),
	cardCount: z
		.string()
		.min(1, { message: "El número de cartas es requerido" }),
	stock: z.string().min(1, { message: "El stock es requerido" }),
})

type FormValues = z.infer<typeof formSchema>

interface AddPackFormProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onAddPack?: (packData: any) => void
}

const AddPackForm: React.FC<AddPackFormProps> = ({
	open,
	onOpenChange,
	onAddPack = () => {},
}) => {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			price: "",
			imageUrl: "",
			cardCount: "5",
			stock: "1",
		},
	})

	const onSubmit = (data: FormValues) => {
		// Convertir valores numéricos
		const packData = {
			...data,
			price: Number(data.price),
			cardCount: Number(data.cardCount),
			stock: Number(data.stock),
			id: crypto.randomUUID(),
		}

		onAddPack(packData)
		toast.success("Paquete agregado correctamente")
		form.reset()
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-background border-gold/30 sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold text-gold">
						Agregar Nuevo Paquete
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nombre</FormLabel>
										<FormControl>
											<Input
												placeholder="Nombre del paquete"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="cardCount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Número de cartas</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Cantidad de cartas por paquete"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Precio</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Precio en Yugi Pesos"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="stock"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Stock</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Unidades disponibles"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="imageUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>URL de imagen</FormLabel>
									<FormControl>
										<Input
											placeholder="URL de la imagen del paquete"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descripción</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Descripción del paquete"
											className="resize-none min-h-[100px] bg-black/30 border-gold/20"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								className="border-gold/30 text-gold hover:bg-gold/10"
							>
								Cancelar
							</Button>
							<Button
								type="submit"
								className="bg-gold hover:bg-gold/80 text-black"
							>
								Guardar Paquete
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default AddPackForm
