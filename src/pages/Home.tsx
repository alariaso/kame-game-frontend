import { NavLink } from "react-router";
import { H1 } from "@/elements/H1"
import { H2 } from "@/elements/H2";
import { P } from "@/elements/P";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/AuthContext";
import { ShoppingCart, BookOpen, Swords } from "lucide-react";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export const Home: React.FC = () => {
    const { user } = useUser();
    // TODO: complete the layout
    return (
        <>
            <section className="bg-[#250032] py-10 flex items-center justify-center">
                <div className="container mx-auto flex flex-col items-center justify-center">
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


            <section className="py-14 flex flex-col justify-center">
                <div className="container mx-auto flex flex-col gap-5 justify-center">
                    <H2 className="text-primary text-center">Descubre el poder de las cartas</H2>
                    <div className="flex justify-center gap-10 flex-wrap mt-10">
                        <Card className="w-full max-w-sm bg-black">
                            <CardHeader>
                                <ShoppingCart className="mx-auto"/>
                                <CardTitle className="text-center">Amplia colección</CardTitle>
                                <CardDescription className="text-center">
                                    Descubre una extensa selección de cartas raras y paquetes exclusivos para potenciar tu mazo.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="w-full max-w-sm bg-black">
                            <CardHeader>
                                <BookOpen className="mx-auto"/>
                                <CardTitle className="text-center">Gestión de cartas</CardTitle>
                                <CardDescription className="text-center">
                                    Organiza tus cartas y crea estrategias imbatibles con nuestro sistema de gestión de mazos.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="w-full max-w-sm bg-black">
                            <CardHeader>
                                <Swords className="mx-auto"/>
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
