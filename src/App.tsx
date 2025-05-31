import { Routes, Route } from "react-router";
import { Home } from './pages/Home.tsx';
import { Store } from './pages/Store.tsx';
import { Login } from './pages/Login.tsx';
import { Signup } from './pages/Signup.tsx';
import { Cart } from './pages/Cart.tsx';
import { Battle } from './pages/Battle.tsx';
import { Admin } from './pages/Admin.tsx';
import { Header } from './components/Header.tsx';
import { Inventory } from "./pages/Inventory.tsx";
import { UserProvider } from "./UserProvider.tsx";

export const App: React.FC = () => {
  return (
    <UserProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tienda" element={<Store />} />
        <Route path="/inventario" element={<Inventory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Signup />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/batalla" element={<Battle />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </UserProvider>
  )
}
