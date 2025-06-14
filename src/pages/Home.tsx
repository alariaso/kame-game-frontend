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
import React from "react";

export const Home: React.FC = () => {
    const { user } = useUser();

    return (
        <>
            <section className="bg-[#250032]">
                <section>
                    <H1>Kame Game</H1>
                    <P className="text-center">
                        Tu tienda virtual de cartas donde puedes comprar, coleccionar y batallar
                    </P>
                    <section className="flex justify-center gap-6">
                        {user ? <>
                            <Button variant="default"> <ShoppingCart/>Visitar Tienda</Button>
                            <Button variant="outline"><Swords/>Ir a Batallas</Button>
                        </> : <>
                            <Button variant="default">Crear Cuenta</Button>
                            <Button variant="outline">Acceder</Button>
                        </>}
                    </section>
                </section>
            </section>


            <section>
                <H2 className="text-primary text-center">Descubre el poder de las cartas</H2>
                <section className="flex justify-center gap-10 flex-wrap">
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <ShoppingCart className="mx-auto"/>
                            <CardTitle className="text-center">Amplia colección</CardTitle>
                            <CardDescription className="text-center">
                            Descubre una extensa selección de cartas raras y paquetes exclusivos para potenciar tu mazo.
                        </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <BookOpen className="mx-auto"/>
                            <CardTitle className="text-center">Gestión de cartas</CardTitle>
                            <CardDescription className="text-center">
                                Organiza tus carts y crea estrategias imbatibles con nuestro sistema de gestión de mazos.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <Swords className="mx-auto"/>
                            <CardTitle className="text-center">Duelos místicos</CardTitle>
                            <CardDescription className="text-center">
                                Enfrenta a los trabajadores del mercado místico y prueba tus habilidades en intensos duelos.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </section>
            </section>
        </>
    )
}
