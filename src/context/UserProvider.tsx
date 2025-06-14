import { useEffect, useMemo, useState } from "react";
import type { LoginParams, User, UpdateParams } from "@/api";
import { UserContext } from "./UserContext";
import { login as apiLogin, logout as apiLogout, update as apiUpdate } from "@/api";
import { toast } from "sonner";

type UserProviderProps = React.PropsWithChildren;

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const savedUserJson = localStorage.getItem("user")
        if (savedUserJson !== null) {
            const savedUser = JSON.parse(savedUserJson);
            setUser(savedUser)
        }
        setLoading(false)
    }, [])

    const login = async (loginParams: LoginParams) => {
        setLoading(true)
        try {
            const user = await apiLogin(loginParams)
            setUser(user)
            setError("")
            localStorage.setItem("user", JSON.stringify(user))
        } catch (err) {
            setUser(null)
            localStorage.removeItem("user")
            localStorage.removeItem("cart")
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage)
            toast.error(errorMessage)
        }
        setLoading(false)
    }

    const logout = async () => {
        setLoading(true)
        try {
            await apiLogout();
            setUser(null)
            setError("")
            localStorage.removeItem("user")
            localStorage.removeItem("cart")
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage)
            localStorage.removeItem("user")
            localStorage.removeItem("cart")
            toast.error(errorMessage)
        }
        setLoading(false)
    }

    const update = async (updateParams: UpdateParams) => {
        setLoading(true);
        try {
            const updatedUser = await apiUpdate(updateParams);
            setUser(updatedUser);
            setError("")
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage)
            toast.error(errorMessage)
        }
        setLoading(false);
    }

    const value = useMemo(() => ({ user, loading, error, login, logout, update }), [user, loading, error])
    return <UserContext value={value}>{children}</UserContext>
}
