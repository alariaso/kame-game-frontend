import type React from "react";
import { Link } from "react-router";
import { useUser } from "../UserContext";
import { LogOut, ShoppingCart, Wallet } from "lucide-react";
import { Button } from "../elements/Button";

export const Header: React.FC = () => {
    const { user, logout } = useUser();

    const handleLogout = () => {
        logout()
    }

    return (
        <nav className="bg-black text-white flex justify-between p-9 items-center">
            <Link to="/" className="text-yellow-400 font-bold text-xl">Kame Game</Link>
            <ul className="flex gap-5 items-center">
                <li><Link to="/tienda">Tienda</Link></li>
                { user !== null && <>
                    <li><Link to="/inventario">Inventario</Link></li>
                    <li><Link to="/batalla">Batalla</Link></li>
                </>}
                { user?.isAdmin && <li><Link to="/admin">Administración</Link></li>}
            </ul>
            <ul className="flex gap-5 items-center">
                {user === null ? <>
                    <li className="p-3"><Link to="/login">Iniciar Sesión</Link></li>
                    <li><Button component={Link} to="/registro">Crear Cuenta</Button></li>
                </> : <>
                    <li className="text-yellow-400 p-2"><Wallet className="inline-block align-text-bottom" size={20} /> {user.yugiPesos} YP</li>
                    <li><Link to="/carrito" className="border-1 border-yellow-400 text-yellow-400 p-3 rounded-sm block"><ShoppingCart size={20} /></Link></li>
                    <li className="p-2">Hola, {user.username}</li>
                    <li onClick={handleLogout}><Button kind="outline"><LogOut size={20} className="inline-block align-text-bottom" /> Salir</Button></li>
                </>}
            </ul>
        </nav>
    )
};
