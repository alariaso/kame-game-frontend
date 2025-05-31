import { createContext, use } from "react";
import type { LoginParams, User } from "./api";

type UserContextType = {
    user: User | null;
    login: (loginParams: LoginParams) => Promise<void>;
    logout: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>(null!);

export const useUser = () => {
    const user = use(UserContext);

    return user;
}
