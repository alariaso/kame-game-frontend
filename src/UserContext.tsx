import { createContext, use } from "react";
import type { LoginParams, User } from "./api";

type UserContextType = {
    user: User | null;
    login: (loginParams: LoginParams) => Promise<void>;
    logout: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>(null!);

export const useUser = () => {
    const userContext = use(UserContext);

    return userContext;
}

// only use in routes that are children of RequireAuth in App.tsx
export const useAuthenticatedUser = () => {
    const { user } = use(UserContext);

    return user!;
}
