import { useEffect, useMemo, useState } from "react";
import type { LoginParams, User } from "./api";
import { UserContext } from "./UserContext";
import { login as apiLogin, logout as apiLogout } from "./api";

type UserProviderProps = React.PropsWithChildren;

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const value = useMemo(() => ({ user, login, logout }), [user])

    useEffect(() => {
        const savedUserJson = sessionStorage.getItem("user")
        if (savedUserJson !== null) {
            const savedUser = JSON.parse(savedUserJson);
            setUser(savedUser)
        }
    }, [])

    const login = async (loginParams: LoginParams) => {
        try {
            const user = await apiLogin(loginParams)
            setUser(user)
            sessionStorage.setItem("user", JSON.stringify(user))
        } catch {
            setUser(null)
            sessionStorage.removeItem("user")
            // FIXME: handle error
        }
    }

    const logout = async () => {
        try {
            await apiLogout();
            setUser(null)
            sessionStorage.removeItem("user")
        } catch {
            console.error("error") // FIXME: handle error
        }
    }

    return <UserContext value={value}>{children}</UserContext>
}
