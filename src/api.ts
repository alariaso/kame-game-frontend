import cards from './assets/some-cards.json'

export type User = {
    username: string;
    isAdmin: boolean;
    yugiPesos: number;
};

export type Product = Card | Pack;

export type CardKind = "DARK" | "DIVINE" | "EARTH" | "FIRE" | "LIGHT" | "WATER" | "WIND";

export type Card = {
    category: "card";
    id: number;
    name: string;
    price: number;
    image_url: string;
    kind: CardKind;
    stock: number;
    attack: number;
}

export type PackRarity = "COMMON" | "RARE" | "SUPER RARE" | "ULTRA RARE"

export type Pack = {
    category: "pack";
    id: number;
    name: string;
    price: number;
    image_url: string;
    rarity: PackRarity;
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

export type UpdateParams = {
    username: string;
    isAdmin: boolean;
    yugiPesos: number;
}

// PUT /update
export const update = async (params: UpdateParams): Promise<User> => {
    await sleep(1);
    const updatedUser = {
        username: params.username,
        isAdmin: params.isAdmin,
        yugiPesos: params.yugiPesos
    }

    return updatedUser;
}

export type GetCardsParams = {
    page: number;
    itemsPerPage: number;
    cardName?: string;
    cardKind?: CardKind; // TODO agregar en el enunciado que se puede filtrar por tipo de carta
};

const sleep = (seconds: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};

// GET /cards
export const getCards = async (params: GetCardsParams): Promise<Card[]> => {
    await sleep(2); // simulate api call time
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
    await sleep(2);
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

// GET /cart
export const getCartIDs = async (): Promise<number[]> => {
    await sleep(3)
    const cartJSON = localStorage.getItem("cart");
    if (cartJSON) {
        return JSON.parse(cartJSON);
    }
    return []
}

export type AddToCartParams = {
    productId: number;
};

// POST /cart/add
export const addToCart = async (params: AddToCartParams): Promise<void> => {
    await sleep(2);
    const cartJSON = localStorage.getItem("cart");
    let cart = [];
    if (cartJSON !== null) {
        cart = JSON.parse(cartJSON);
    }
    cart.push(params.productId)
    localStorage.setItem("cart", JSON.stringify(cart))
}

export type RemoveFromCartParams = {
    productId: number;
};

// POST /cart/remove
export const removeFromCart = async (params: RemoveFromCartParams): Promise<void> => {
    console.log(params) // para que eslint no se queje de no estar utilizando `params`
}
