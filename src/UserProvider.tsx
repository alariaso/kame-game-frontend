import { useEffect, useMemo, useState } from "react";
import type { LoginParams, User } from "./api";
import { UserContext } from "./UserContext";
import { login as apiLogin, logout as apiLogout } from "./api";

type UserProviderProps = React.PropsWithChildren;

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

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
            localStorage.setItem("user", JSON.stringify(user))
        } catch {
            setUser(null)
            localStorage.removeItem("user")
            // FIXME: handle error
        }
        setLoading(false)
    }

    const logout = async () => {
        setLoading(true)
        try {
            await apiLogout();
            setUser(null)
            localStorage.removeItem("user")
        } catch {
            console.error("error") // FIXME: handle error
        }
        setLoading(false)
    }

    const value = useMemo(() => ({ user, loading, login, logout }), [user, loading])
    return <UserContext value={value}>{children}</UserContext>
}
