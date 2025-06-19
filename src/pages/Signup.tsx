import { Link, useLocation, useNavigate } from "react-router";
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
import { H1 } from "@/elements/H1";
import { P } from "@/elements/P";

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

    return (
        <div className="min-h-[calc(100vh-100px)] flex justify-center items-center">
            <div className="bg-[#1E1E1EE5] w-full max-w-md px-10 py-8 rounded-lg space-y-6">
                <div>
                    <div className="mx-auto rounded-full bg-primary/20 h-12 w-12 flex justify-center items-center">
                        <UserRoundPlus className="text-primary h-6 w-6"/>
                    </div>
                    <H1>Crear cuenta</H1>
                    <P className="text-center">Únete al mercado de cartas más exclusivo</P>
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
                                        {form.formState.errors.username ? <>
                                                <FormMessage />
                                            </> : <>
                                                <FormMessage className="text-[#FFF]">Solo letras, entre 3 y 30 carácteres</FormMessage>
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
                                            <FormMessage className="text-[#FFF]">Entre 3 y 50 carácteres</FormMessage>
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
                <P className="text-center">¿Ya tienes cuenta? <Link to={"/login"} className="text-primary">Iniciar sesión</Link></P>
            </div>
        </div>
    )
}
