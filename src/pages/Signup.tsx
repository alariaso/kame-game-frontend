import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { CirclePlus, UserRoundPlus } from "lucide-react";
import { P } from "@/elements/P";
import { FormContainer } from "@/components/FormContainer"
import { useUser } from "@/context/UserContext";

const FormSchema = z.object({
    username: z.string()
    .trim()
    .min(3)
    .max(30),
    password: z.string()
    .trim()
    .min(8)
    .max(50),
    confirmPassword: z.string()
    .trim()
    .min(8)
    .max(50)
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
})

export const Signup: React.FC = () => {
    const { user, loading } = useUser();
    const location = useLocation();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: ""
        }
    })

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        await navigate(location.state?.prevLocation || "/"); // TODO: implement?
        console.log(values) // eslint error
    }

    if (loading) {
        return <p>Loading...</p>
    }

    if (user !== null) {
        return <Navigate to={location.state?.prevLocation || "/"} />
    }

    return (
        <FormContainer
        header={{
            title: "Crear cuenta",
            description: "Únete al mercado de cartas más exclusivo",
            icon: UserRoundPlus
        }}
        footer={<P className="text-center">¿Ya tienes cuenta? <Link to={"/login"} className="text-primary">Iniciar sesión</Link></P>}
        >
            <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre de usuario</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ingresa tu nombre de usuario" className="border-primary" {...field}></Input>
                                        </FormControl>
                                        {form.formState.errors.username ? <>
                                                <FormMessage />
                                            </> : <>
                                                <FormMessage className="text-muted-foreground">Solo letras, entre 3 y 30 carácteres</FormMessage>
                                            </>
                                        }
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Ingresa tu contraseña" className="border-primary" {...field}></Input>
                                    </FormControl>
                                    {form.formState.errors.password ? <>
                                            <FormMessage />
                                        </> : <>
                                            <FormMessage className="text-muted-foreground">Entre 3 y 50 carácteres</FormMessage>
                                        </>
                                    }
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirmar contraseña</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Confirma tu constraseña" className="border-primary" {...field}></Input>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full cursor-pointer" type="submit"><CirclePlus className="text-background"/>Crear cuenta</Button>
                    </form>
                </Form>
        </FormContainer>
    )
}
