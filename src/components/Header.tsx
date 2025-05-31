import type React from "react";
import { Link } from "react-router";

export const Header: React.FC = () => <ul>
    <li><Link to="/">Kame Game</Link></li>
    <li><Link to="/tienda">Tienda</Link></li>
    <li><Link to="/inventario">Inventario</Link></li>
    <li><Link to="/batalla">Batallas</Link></li>
    {/* si es admin... <li><Link to="/admin">Administración</Link></li> */}
</ul>;
