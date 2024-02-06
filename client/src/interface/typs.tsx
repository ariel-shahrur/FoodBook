export interface cartItem {
    id: number,
    customerId: number,
    recipe_id: number,
    ingredientName: string,
    Price: number,
    quantity: number,
    recipeName: string
};

export interface inventoryIngredient {
    IngredientName: string,
    Price: number,
    Quantity: number,
    id: number
};

export interface ingredient {
    quantity: string,
    ingredient: string
};

export interface orderItem {
    id: string,
    customerId: string,
    orderDate: string,
    IngredientName: string,
    quantity: string
}

export interface navItem {
    displayStr: string;
    hrefStr: string;
    key: string
}

export interface footerItem {
    displayStr: string;
    hrefStr: string;
    key: string
}

export interface RecipeInput {
    quantity: string;
    ingredient: string;
}

export interface Recipe {
    id: number;
    name: string;
    time: number;
    ingredientsNum: number;
    servingNum: number;
    Description: string;
    likes: number;
    ingredients: Record<string, RecipeInput[]>;
    directions: Record<string, string[]>;
    comments: string[];
    usernameId: number;
    profileImg: string;
    images:string[]
}

export interface recipePost {
    recipeName: string;
    time: number;
    ingredientsNum: number;
    servingNum: number;
    Description: string;
    likes: number;
    ingredients: Record<string, RecipeInput[]>;
    directions: Record<string, string[]>;
    images: FormData
}

export interface RecipeInput {
    quantity: string;
    ingredient: string;
}

export interface signUpForm {
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    profileImg: string
}

export interface message {
    username: string, messageDate: string, id: number
}

export interface recipePostCharcterValidtion {
    recipeName: boolean | string,
    Description: boolean | string,
    ingredient: boolean | string,
    direction: boolean | string,
    quantity: boolean | string,
    allData: boolean | string,
}