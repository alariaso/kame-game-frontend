import { Navigate, useLocation, useNavigate, Link } from "react-router";
import { useUser } from "@/context/UserContext";
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
import { LogOut, UserRound } from "lucide-react";
import { H1 } from "@/elements/H1";
import { P } from "@/elements/P";

const FormSchema = z.object({
    username: z.string().
    trim().
    min(3).
    max(30),
    password: z.string().
    trim().
    min(8).
    max(50)
})

export const Login: React.FC = () => {
    const { user, loading, login } = useUser();
    const location = useLocation();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    })
    
    async function onSubmit(values: z.infer<typeof FormSchema>) {
        await login({username: values.username, password: values.password});
        await navigate(location.state?.prevLocation || "/");
    }

    if (loading) {
        return <p>Loading...</p>
    }

    if (user !== null) {
        return <Navigate to={location.state?.prevLocation || "/"} />
    }

    return (
        <div className="min-h-[calc(100vh-100px)] flex justify-center items-center">
            <div className="bg-[#1E1E1EE5] w-full max-w-md px-10 py-8 rounded-lg space-y-6">
                <div>
                    <div className="mx-auto rounded-full bg-primary/20 h-12 w-12 flex justify-center items-center">
                        <UserRound className="text-primary h-6 w-6"/>
                    </div>
                    <H1>Iniciar sesión</H1>
                    <P className="text-center">Accede a tu cuenta para comprar cartas y participar en duelos</P>
                </div>
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
                                        <FormMessage />
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full cursor-pointer" type="submit"><LogOut className="text-background"/>Iniciar sesión</Button>
                    </form>
                </Form>
                <P className="text-center">¿No tienes cuenta? <Link to={"/registro"} className="text-primary">Regístrate</Link></P>
            </div>
        </div>
    )
}
