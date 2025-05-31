import cards from './assets/some-cards.json'

export type User = {
    username: string;
    isAdmin: boolean;
    yugiPesos: number;
};

export type CardKind = "DARK" | "DIVINE" | "EARTH" | "FIRE" | "LIGHT" | "WATER" | "WIND";

export type Card = {
    id: number;
    name: string;
    kind: CardKind;
    price: number;
    stock: number;
    attack: number;
    image_url: string;
}

export type PackRarity = "COMMON" | "RARE" | "SUPER RARE" | "ULTRA RARE"

export type Pack = {
    id: number;
    name: string;
    price: number;
    rarity: PackRarity;
    image_url: string;
};

export type LoginParams = {
    username: string;
    password: string;
}

// POST /login
export const login = async (params: LoginParams): Promise<User> => {
    const user = {
        username: params.username,
        isAdmin: false,
        yugiPesos: 10000
    }
    return user;
}

// GET /logout
export const logout = async (): Promise<void> => {
}

export type SignupParams = {
    username: string;
    password: string;
}

export const signup = async (params: SignupParams): Promise<User> => {
    const user = {
        username: params.username,
        isAdmin: false,
        yugiPesos: 10000
    }
    return user;
}

export type GetCardsParams = {
    page: number;
    itemsPerPage: number;
    cardName?: string;
    cardKind?: CardKind; // TODO agregar en el enunciado que se puede filtrar por tipo de carta
};

// GET /cards
export const getCards = async (params: GetCardsParams): Promise<Card[]> => {
    return cards.slice(params.itemsPerPage*(params.page-1), params.itemsPerPage*params.page) as Card[]
}

export type GetPacksParams = {
    page: number;
    itemsPerPage: number;
    packName?: string;
    packRarity?: PackRarity; // TODO agregar en el enunciado que se puede filtrar por rareza de producto
};

// GET /packs
export const getPacks = async (params: GetPacksParams): Promise<Pack[]> => {
    console.log(params) // para que eslint no se queje de no estar utilizando `params`
    return [];
}

export type GetInventoryParams = {
    page: number;
    itemsPerPage: number;
};

// GET /inventory
export const getInventory = async (params: GetInventoryParams): Promise<Card[]> => {
    const c = cards.slice(0, 24);
    return c.slice(params.itemsPerPage*(params.page-1), params.itemsPerPage*params.page) as Card[]
}

export type AddToCartParams = {
    productId: number;
};

// POST /cart/add
export const addToCart = async (params: AddToCartParams): Promise<void> => {
    console.log(params) // para que eslint no se queje de no estar utilizando `params`
}

export type RemoveFromCartParams = {
    productId: number;
};

// POST /cart/remove
export const removeFromCart = async (params: RemoveFromCartParams): Promise<void> => {
    console.log(params) // para que eslint no se queje de no estar utilizando `params`
}
