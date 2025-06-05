import { NavLink } from "react-router";
import { useUser } from "../../UserContext";
import { LogOut, ShoppingCart, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./Header.css";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useEffect, useState } from "react";

type WindowSizeState = {
    width: number;
    height: number;
}

export const Header: React.FC = () => {
    const { user, logout } = useUser();
    const [windowSize, setWindowSize] = useState<WindowSizeState>(() => ({width: window.innerWidth, height: window.innerHeight}));

    const handleLogout = async () => {
        await logout()
    }

    useEffect(() => {
        window.addEventListener("resize", () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        })
    }, [])

    const inSmallScreen = windowSize.width < 960;

    const otherLinks = (
        <>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <NavLink to="/tienda">Tienda</NavLink>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                { user != null && <>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <NavLink to="/inventario">Inventario</NavLink>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <NavLink to="/batalla">Batalla</NavLink>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </>}
                { user?.isAdmin && <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <NavLink to="/admin">Administración</NavLink>
                    </NavigationMenuLink>
                </NavigationMenuItem>}
            </NavigationMenuList>

            <NavigationMenuList>
                { user === null ? <>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <NavLink to="/login">Iniciar Sesión</NavLink>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Button asChild>
                                <NavLink to="/registro">Crear Cuenta</NavLink>
                            </Button>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </> : <>
                    <NavigationMenuItem>
                        <Button variant="ghost" className="cursor-pointer text-primary">
                            <Wallet /> {user.yugiPesos} YP
                        </Button>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <NavLink to="/carrito" className="border-1 border-primary p-3 rounded-sm block cart-navlink">
                                <ShoppingCart className="text-primary" />
                            </NavLink>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        Hola, {user.username}
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Button onClick={handleLogout} variant="outline" className="cursor-pointer"><LogOut size={20} /> Salir</Button>
                    </NavigationMenuItem>
                </>}
            </NavigationMenuList>
        </>
    );

    return (
        <header>
            <NavigationMenu className="p-9 data-[orientation=horizontal]:max-w-full justify-between" orientation={inSmallScreen ? "vertical" : "horizontal"}>
                <NavigationMenuList data-orientation="horizontal">
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <NavLink to="/" className="text-primary font-bold text-xl hover:text-primary">Kame Game</NavLink>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    {inSmallScreen && <NavigationMenuItem>
                            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                            <NavigationMenuContent className="w-dvw">{otherLinks}</NavigationMenuContent>
                    </NavigationMenuItem>}
                </NavigationMenuList>

                {!inSmallScreen && otherLinks}
            </NavigationMenu>
        </header>
    )
};
