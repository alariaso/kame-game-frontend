export type User = {
    username: string;
    isAdmin: boolean;
    yugiPesos: number;
};

export type LoginParams = {
    username: string;
    password: string;
}

export type LoginResponse = {
    user: User | null;
    error: string | null;
};

export const login = async (params: LoginParams): Promise<LoginResponse> => {
    const user = {
        username: params.username,
        isAdmin: false,
        yugiPesos: 10000
    }
    return { user, error: null }
}
