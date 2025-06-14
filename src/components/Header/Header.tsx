import { NavLink } from "react-router";
import { useUser } from "@/context/UserContext";
import { LogOut, ShoppingCart, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popup } from "../Popup";
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
import { useCart } from "@/context/CartContext";

type WindowSizeState = {
    width: number;
    height: number;
}

export const Header: React.FC = () => {
    const { user, logout, update } = useUser();
    const [windowSize, setWindowSize] = useState<WindowSizeState>(() => ({width: window.innerWidth, height: window.innerHeight}));
    // popup states, estan aca para que el popup sea "reutilizable"
    // se pueden mover al popup si se ve necesario
    const [error, setError] = useState("")
    const [amount, setAmount] = useState("");
    const amountAsNumber = Number(amount);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleLogout = async () => {
        await logout()
    }

    const handleAddFunds = async () => {
        // validate input
        if (user) {
            if (!amount || isNaN(amountAsNumber)) {
                // TODO: handle
                console.log(amountAsNumber)
                return;
            }

            try {
                await update({...user, yugiPesos: user.yugiPesos + amountAsNumber})
                setIsPopupOpen(false);
            } catch {
                // TODO: handle error
            } finally {
                setAmount("");
            }
        }
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
                    <Popup 
                        title="Recargar Yugi Pesos"
                        description="Ingresa la cantidad que deseas recargar a tu cuenta"
                        input={{className: "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                            value: amount,
                            type: "number",
                            placeholder: "Cantidad a recargar",
                            onChange: (e) => setAmount(e.target.value), // to controll the amount state
                            onKeyDown: (e) => {
                                if (e.key === 'Enter') {
                                    handleAddFunds();
                                }
                            }}}
                        actionButton={{
                            buttonProps: { onClick: handleAddFunds },
                            text: "Recargar"
                        }}
                        open={isPopupOpen}
                        onOpenChange={setIsPopupOpen}
                    >
                        <Button variant="ghost" className="cursor-pointer text-primary">
                            <Wallet /> {user.yugiPesos} YP
                        </Button>
                    </Popup>

                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <NavLink to="/carrito" className="border-1 border-primary p-3 rounded-sm block cart-navlink">
                                <CartButton />
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

const CartButton: React.FC = () => {
    const { cart } = useCart();

    return (
      <div className="relative">
        <ShoppingCart className="text-primary" />
        {cart.length > 0 && <span className="absolute -top-4 -right-5 text-xs bg-primary w-5 h-5 leading-5 text-center align-middle content-center rounded-full block">{cart.length}</span>}
      </div>
    )
}
