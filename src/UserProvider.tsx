import { useState } from "react";
import type { User } from "./api";
import { UserContext } from "./UserContext";

type UserProviderProps = React.PropsWithChildren;

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (user: User) => {
        setUser(user)
    }

    const logout = () => {
        setUser(null)
    }

    return <UserContext value={{user, login, logout}}>{children}</UserContext>
}
