import React, { useEffect, useState } from 'react'
import { Recipe } from '../../interface/typs';
import Cookies from 'js-cookie';
import RecipeCard from '../../card/RecipeCard';
import { AiOutlineShoppingCart } from "react-icons/ai";
import './favorites.css'
import { useNavigate } from 'react-router-dom';
import { inventoryIngredient, ingredient } from '../../interface/typs';
import { MdDelete } from 'react-icons/md';
import { TbExclamationMark } from "react-icons/tb";
import { FcDislike } from "react-icons/fc";

function Favorites() {
    const bearerToken = Cookies.get('token');
    const navigate = useNavigate();
    const [inventory, setInventory] = useState<inventoryIngredient[]>([]);
    const [messageSent, setMessageSent] = useState(false);
    const [favoritesRecipeData, setFavoritesRecipeData] = useState<Recipe[]>([]);
    const [missingIngredientsForCart, setAddToCartMissingIngredients] = useState<ingredient[]>([]);
    const [recipeWithoutMisiingIngredients, setRecipeWithoutMisiingIngredients] = useState<Recipe>();


    useEffect(() => {
        fetch("http://127.0.0.1:3005/favorite", {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${bearerToken}`
            },
        })
            .then(favoritesStr => { return favoritesStr.json() })
            .then(favoritesObj => {
                setFavoritesRecipeData(favoritesObj);
            });

        fetch("http://127.0.0.1:3005/management/Inventory", {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${bearerToken}`
            },
        })
            .then(inventoryStr => { return inventoryStr.json() })
            .then(inventoryObj => {
                setInventory(inventoryObj);
            })
    }, []);


    const deleteRecipeFromFavorite = async (recipeId: number) => {

        await fetch("http://127.0.0.1:3005/favorite", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${bearerToken}`
            },
            body: JSON.stringify({ recipeId }),
        }).then(dataStr=>{return dataStr.json()})
        .then(dataObj=>{
            setFavoritesRecipeData(dataObj);
        })
    }



    const addToCart = async (curr: Recipe) => {
        let missingIngredients: ingredient[] = [];

        const updatedIngredients = Object.fromEntries(
            Object.entries(curr.ingredients).map(([ingredientsTitle, ingredients]) => {
                const missingIngredientsByTitle: ingredient[] = ingredients.filter(({ quantity, ingredient }) => {//filter the missing ingredients
                    return !inventory.some(
                        (inventoryIngredient) =>
                            inventoryIngredient.IngredientName.toLocaleLowerCase() ===
                            ingredient.toLocaleLowerCase()
                    );
                });

                const ingredientsWithoutmisiing: ingredient[] = ingredients.filter(({ quantity, ingredient }) => {// update ingredients without missing ingredients
                    return inventory.some(
                        (inventoryIngredient) =>
                            inventoryIngredient.IngredientName.toLocaleLowerCase() ===
                            ingredient.toLocaleLowerCase()
                    );
                });

                missingIngredients = missingIngredients.concat(missingIngredientsByTitle);

                return [ingredientsTitle, ingredientsWithoutmisiing]; //return {title:updateIngredients[]}
            })
        );
        setAddToCartMissingIngredients(missingIngredients);
        setRecipeWithoutMisiingIngredients({ ...curr, ingredients: updatedIngredients });

        if (missingIngredients.length === 0) {
            await fetch('http://127.0.0.1:3005/favorite/addToCart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${bearerToken}`,
                },
                body: JSON.stringify(curr),
            });
            navigate('/cart')
        }
    };

    const addToCartWithoutMissingIngredients = async () => {
        await fetch('http://127.0.0.1:3005/favorite/addToCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearerToken}`,
            },
            body: JSON.stringify(recipeWithoutMisiingIngredients),
        });
        setAddToCartMissingIngredients([])
        navigate('/cart')
    }

const sendMessangeToAdmin = async () => {
    if(!messageSent)
    await fetch('http://127.0.0.1:3005/messages/sendMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(missingIngredientsForCart),
    });
    setMessageSent(true);
}


    return (
        <div className='favoriteBody'>
            {favoritesRecipeData.length === 0 && <div className='noFavoriteRecipeDiv'>
                <FcDislike size={150} />
                <h1>You have no any favorite recipes yet</h1>
                <h1>go to feed to add one</h1>
                <button onClick={() => { navigate('/feed') }} className="goto-feed-btn">GO TO FEED</button>
            </div>}
            {missingIngredientsForCart.length === 0 ? (
                <div>
                    {favoritesRecipeData.map((curr, index) => {
                        return (
                            <div key={curr.id} className="recipeNotepad">
                                <MdDelete className="delete-icon" onClick={() => deleteRecipeFromFavorite(curr.id)} />
                                <RecipeCard recipeData={curr} />
                                <div className="cartIconeDiv">
                                    <AiOutlineShoppingCart size={30} onClick={() => addToCart(curr)} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : <div>

                <div className='missingIngredientMessageDiv'>
                    <TbExclamationMark className="TbExclamationMarkIcon" size={100} />
                    <h2 className="missingTitle">missing ingredients</h2>
                    {missingIngredientsForCart.map((missingIngredient,index) => {
                        return <li key={index} className='missingIngredient'>{missingIngredient.ingredient} are missing</li>
                    })}
                    <div className='requestDiv'>
                        {!messageSent && <button className='admin-request-btn' onClick={()=>{sendMessangeToAdmin()}}>Send request for admin to add ingredients</button>}
                        {messageSent && <div>Your request has been sent</div>}
                    </div>
                    
                    <p className="message">continue to cart without the missing ingredients</p>
                    <AiOutlineShoppingCart className='cartIcon' size={40} onClick={() => addToCartWithoutMissingIngredients()} />
                </div>
            </div>}
        </div>
    )
}

export default Favorites