import { NavLink } from "react-router";
import { H1 } from "@/elements/H1"
import { H2 } from "@/elements/H2";
import { P } from "@/elements/P";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { ShoppingCart, BookOpen, Swords } from "lucide-react";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export const Home: React.FC = () => {
    const { user } = useUser();

    return (
        <>
            <section className="bg-[#250032] py-10 md:py-14 flex items-center justify-center">
                <div className="container mx-auto">
                    <H1>Kame Game</H1>
                    <P className="text-center">
                        Tu tienda virtual de cartas donde puedes comprar, coleccionar y batallar
                    </P>
                    <div className="flex justify-center gap-6 mt-6">
                        {user ? <>
                            <NavLink to="/tienda">
                                <Button variant="default" className="cursor-pointer"><ShoppingCart/>Visitar Tienda</Button>
                            </NavLink>
                            <NavLink to="/batalla">
                                <Button variant="outline" className="cursor-pointer"><Swords/>Ir a Batallas</Button>
                            </NavLink>
                        </> : <>
                            <NavLink to="/registro">
                                <Button variant="default" className="cursor-pointer">Crear Cuenta</Button>
                            </NavLink>
                            <NavLink to="/login">
                                <Button variant="outline" className="cursor-pointer">Acceder</Button>
                            </NavLink>
                        </>}
                    </div>
                </div>
            </section>


            <section className="py-14 md:py-18">
                <div className="container mx-auto">
                    <H2 className="text-primary text-center">Descubre el poder de las cartas</H2>
                    <div className="flex justify-center items-center gap-15 flex-wrap mt-10">
                        <Card className="w-full max-w-sm bg-black">
                            <CardHeader className="flex flex-col gap-4 items-center">
                                <div className="mx-auto rounded-full bg-primary/20 h-12 w-12 flex justify-center items-center">
                                    <ShoppingCart className="text-primary h-6 w-6"/>
                                </div>
                                <CardTitle className="text-center">Amplia colección</CardTitle>
                                <CardDescription className="text-center">
                                    Descubre una extensa selección de cartas raras y paquetes exclusivos para potenciar tu mazo.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="w-full max-w-sm bg-black">
                            <CardHeader className="flex flex-col gap-4 items-center">
                                <div className="mx-auto rounded-full bg-primary/20 h-12 w-12 flex justify-center items-center">
                                    <BookOpen className="text-primary h-6 w-6"/>
                                </div>
                                <CardTitle className="text-center">Gestión de cartas</CardTitle>
                                <CardDescription className="text-center">
                                    Organiza tus cartas y crea estrategias imbatibles con nuestro sistema de gestión de mazos.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="w-full max-w-sm bg-black">
                            <CardHeader className="flex flex-col gap-4 items-center">
                                <div className="mx-auto rounded-full bg-primary/20 h-12 w-12 flex justify-center items-center">
                                    <Swords className="text-primary h-6 w-6"/>
                                </div>
                                <CardTitle className="text-center">Duelos místicos</CardTitle>
                                <CardDescription className="text-center">
                                    Enfrenta a los trabajadores del mercado místico y prueba tus habilidades en intensos duelos.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>
        </>
    )
}
