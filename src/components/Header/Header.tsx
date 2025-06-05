import type React from "react";
import { NavLink } from "react-router";
import { useUser } from "../../UserContext";
import { LogOut, ShoppingCart, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./Header.css";

export const Header: React.FC = () => {
    const { user, logout } = useUser();

    const handleLogout = async () => {
        await logout()
    }

    return (
        <header>
            <nav className="bg-background text-foreground flex justify-between p-9 items-center">
                <NavLink to="/" className="text-primary font-bold text-xl">Kame Game</NavLink>
                <ul className="flex gap-5 items-center">
                    <li><NavLink to="/tienda">Tienda</NavLink></li>
                    { user !== null && <>
                        <li><NavLink to="/inventario">Inventario</NavLink></li>
                        <li><NavLink to="/batalla">Batalla</NavLink></li>
                    </>}
                    { user?.isAdmin && <li><NavLink to="/admin">Administración</NavLink></li>}
                </ul>
                <ul className="flex gap-5 items-center">
                    {user === null ? <>
                        <li className="p-3"><NavLink to="/login">Iniciar Sesión</NavLink></li>
                        <li>
                            <Button asChild>
                                <NavLink to="/registro">Crear Cuenta</NavLink>
                            </Button>
                        </li>
                    </> : <>
                        <li>
                            <Button variant="ghost" className="cursor-pointer text-primary">
                                    <Wallet size={20} /> {user.yugiPesos} YP
                            </Button>
                        </li>
                        <li><NavLink to="/carrito" className="border-1 border-primary text-yellow-400 p-3 rounded-sm block cart-navlink"><ShoppingCart size={20} /></NavLink></li>
                        <li className="p-2">Hola, {user.username}</li>
                        <li onClick={handleLogout}><Button variant="outline" className="cursor-pointer"><LogOut size={20} /> Salir</Button></li>
                    </>}
                </ul>
            </nav>
        </header>
    )
};
