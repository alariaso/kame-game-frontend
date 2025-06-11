import { useEffect, useMemo, useState } from "react";
import type { LoginParams, User, UpdateParams } from "./api";
import { UserContext } from "./UserContext";
import { login as apiLogin, logout as apiLogout, update as apiUpdate } from "./api";

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

    const update = async (updateParams: UpdateParams) => {
        setLoading(true);
        try {
            const updatedUser = await apiUpdate(updateParams);
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch {
            // TODO: handle error
        }
        setLoading(false);
    }

    const value = useMemo(() => ({ user, loading, login, logout, update }), [user, loading])
    return <UserContext value={value}>{children}</UserContext>
}
