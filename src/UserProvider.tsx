import { useEffect, useState } from "react";
import type { LoginParams, User } from "./api";
import { UserContext } from "./UserContext";
import { login as apiLogin } from "./api";

type UserProviderProps = React.PropsWithChildren;

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const savedUserJson = sessionStorage.getItem("user")
        if (savedUserJson !== null) {
            const savedUser = JSON.parse(savedUserJson);
            setUser(savedUser)
        }
    }, [])

    const login = async (loginParams: LoginParams) => {
        const res = await apiLogin(loginParams)
        if (res.user !== null) {
            setUser(res.user)
            sessionStorage.setItem("user", JSON.stringify(res.user))
        }
        if (res.error !== null) {
            setUser(null)
            sessionStorage.removeItem("user")
            // FIXME: handle error
        }
    }

    const logout = async () => {
        setUser(null)
        sessionStorage.removeItem("user")
    }

    return <UserContext value={{user, login, logout}}>{children}</UserContext>
}
