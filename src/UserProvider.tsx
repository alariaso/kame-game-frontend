import { useEffect, useState } from "react";
import type { User } from "./api";
import { UserContext } from "./UserContext";

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

    const login = (user: User) => {
        setUser(user)
        sessionStorage.setItem("user", JSON.stringify(user))
    }

    const logout = () => {
        setUser(null)
        sessionStorage.removeItem("user")
    }

    return <UserContext value={{user, login, logout}}>{children}</UserContext>
}
