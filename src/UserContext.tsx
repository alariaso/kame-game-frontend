import { createContext, useContext } from "react";
import type { User } from "./api";
import { useNavigate } from "react-router";

type UserContextType = {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
};

export const UserContext = createContext<UserContextType>(null!);

export const useUser = () => {
    const user = useContext(UserContext);

    return user;
}

export const useUserRequired = () => {
    const user = useUser();
    const navigate = useNavigate();

    if (user === null) {
        navigate("/login")
        return
    }

    return user!;
}

