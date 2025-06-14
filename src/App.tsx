import { Routes, Route, Navigate, useLocation } from "react-router";
import { Home } from './pages/Home.tsx';
import { Store } from './pages/Store.tsx';
import { Login } from './pages/Login.tsx';
import { Signup } from './pages/Signup.tsx';
import { Cart } from './pages/Cart.tsx';
import { Battle } from './pages/Battle.tsx';
import { Admin } from './pages/Admin.tsx';
import { Header } from './components/Header/Header.tsx';
import { Inventory } from "./pages/Inventory.tsx";
import { UserProvider } from "./context/UserProvider.tsx";
import { useUser } from "./context/UserContext.tsx";
import { CartProvider } from "./context/CartProvider.tsx";

export const App: React.FC = () => {
  return (
    <UserProvider>
      <CartProvider>
        <Header />
        <main className="mx-14">
          <Routes>
            <Route index element={<Home />} />
            <Route path="/tienda" element={<Store />} />
            <Route path="/inventario" element={<RequireAuth><Inventory /></RequireAuth>} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Signup />} />
            <Route path="/carrito" element={<RequireAuth><Cart /></RequireAuth>} />
            <Route path="/batalla" element={<RequireAuth><Battle /></RequireAuth>} />
            <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
          </Routes>
        </main>
      </CartProvider>
    </UserProvider>
  )
}

const RequireAuth: React.FC<React.PropsWithChildren> = ({children}) => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return <p>Loading...</p>
  }

  if (user === null) {
    return <Navigate to="/login" state={{"prevLocation": location}} />
  }

  return <>{children}</>;
}
