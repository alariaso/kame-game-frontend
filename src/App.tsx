import { Routes, Route, Navigate } from "react-router";
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
import { useUser } from "./UserContext.tsx";

export const App: React.FC = () => {
  return (
    <UserProvider>
      <Header />
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
    </UserProvider>
  )
}

const RequireAuth: React.FC<React.PropsWithChildren> = ({children}) => {
  const { user } = useUser();
  if (user === null) {
    return <Navigate to="/login" />
  }
  return <>{children}</>;
}
