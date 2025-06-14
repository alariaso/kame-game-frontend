import { createContext, use } from "react";
import type { LoginParams, UpdateParams, User } from "@/api";

type UserContextType = {
    user: User | null;
    loading: boolean;
    error: string;
    login: (loginParams: LoginParams) => Promise<void>;
    logout: () => Promise<void>;
    update: (updateParams: UpdateParams) => Promise<void>;
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
