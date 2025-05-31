import type React from "react";
import { Link } from "react-router";
import { useUser } from "../UserContext";

export const Header: React.FC = () => {
    const { user } = useUser();

    return (
        <nav className="bg-black text-white flex justify-between">
            <Link to="/">Kame Game</Link>
            <ul className="flex gap-5">
                <li><Link to="/tienda">Tienda</Link></li>
                { user !== null && <>
                    <li><Link to="/inventario">Inventario</Link></li>
                    <li><Link to="/batalla">Batalla</Link></li>
                </>}
                { user?.isAdmin && <li><Link to="/admin">Administración</Link></li>}
            </ul>
            <ul className="flex gap-5">
                {user === null ? <>
                    <li><Link to="/login">Iniciar Sesión</Link></li>
                    <li><Link to="/registro">Crear Cuenta</Link></li>
                </> : <>
                    <li>{user.yugiPesos} YP</li>
                    <li><Link to="/carrito">Carrito</Link></li>
                    <li>Hola, {user.username}</li>
                    <li><Link to="/salir">Salir</Link></li>
                </>}
            </ul>
        </nav>
    )
};
