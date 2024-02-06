import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import './cart.css';
import { cartItem } from '../../interface/typs';
import { MdDelete } from "react-icons/md";
import { FcCheckmark } from 'react-icons/fc';

function Cart() {
    const bearerToken = Cookies.get('token');
    const [cart, setCart] = useState<cartItem[]>([]);
    const [orderSucss, setOrderSucss] = useState(false);
    const [ingredientSubtotal, setIngredientSubtotal] = useState(0);
    const Discount = 15;
    const Shipping = 5;

    const groupedIngredients: { [recipeName: string]: cartItem[] } = {};
    useEffect(() => {
        try {
            fetch("http://127.0.0.1:3005/cart", {
                method: 'Get',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${bearerToken}`
                },
            })
                .then(cartDataStr => { return cartDataStr.json() })
                .then(cartDataObj => {
                    setCart(cartDataObj);
                    let amout = 0;
                    cartDataObj.forEach((curr: cartItem) => {
                        amout += (curr.Price * curr.quantity);
                    });
                    setIngredientSubtotal(amout)
                });
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [])

    cart.forEach((cartItem: cartItem) => {// order cart by recipeName //TODO
        if (!groupedIngredients[cartItem.recipeName]) {
            groupedIngredients[cartItem.recipeName] = [];
        }
        groupedIngredients[cartItem.recipeName].push(cartItem);
    });


    const quantityChange = async (currCartItem: cartItem, inc: boolean) => {
        await fetch("http://127.0.0.1:3005/cart/quantitychange", { //request to update quantity 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${bearerToken}`
            },
            body: JSON.stringify({ currCartItem, inc }),
        }).then(cartStr => { return cartStr.json() })
            .then(cartObj => {
                setCart(cartObj);
                setIngredientSubtotal(0);
                let amout = 0;
                cartObj.forEach((curr: cartItem) => {
                    amout += (curr.Price * curr.quantity);
                });
                setIngredientSubtotal(amout);
            })
    }

    const deleteRecipeIngredientsFromCart = async (recipeId: Number) => { // delete all ingredients from cart by recipe id
        await fetch("http://127.0.0.1:3005/cart", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${bearerToken}`
            },
            body: JSON.stringify({ recipe_id: recipeId }),
        }).then(cartStr => { return cartStr.json() })
            .then(cartObj => {
                setCart(cartObj);
                let amout = 0;
                cartObj.forEach((curr: cartItem) => {
                    amout += (curr.Price * curr.quantity);
                });
                setIngredientSubtotal(amout)
            })
    }

    const makeOrder = async () => {
        if (cart.length === 0) {
            return;
        }
        await fetch('http://localhost:3005/cart/makeOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${bearerToken}`
            },
        }).then(() => {
            setOrderSucss(true);
        })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <div className='cartBodyDiv'>
            {!orderSucss && <div className='cartDiv'>
                <div className='ingredientsCartDiv'>
                    {
                        Object.entries(groupedIngredients).map(([recipeName, ingredients]) => {
                            return <div className='rcipeIngredients' key={recipeName}>
                                <MdDelete size={20} className='delete-recipe-cart-btn' onClick={() => { deleteRecipeIngredientsFromCart(ingredients[0].recipe_id) }} />
                                <h3>{recipeName}</h3>
                                {ingredients.map((curr, index) => {
                                    return <div className='rowDiv' key={index}>
                                        <div className='rowItemDiv'>{curr.ingredientName}</div>
                                        <div className='quantitydiv'>
                                            <button className='quantityBtn' onClick={() => { quantityChange(curr, true) }}>+</button>
                                            {+curr.quantity}
                                            <button className='quantityBtn' onClick={() => { quantityChange(curr, false) }}>-</button>
                                        </div>
                                        <div className='rowItemDiv'>{+curr.Price}</div>
                                    </div>
                                })}
                            </div>
                        })

                    }
                </div>
                <div className="summary">
                    <h3>Summary</h3>
                    <div className="summary-item"><span className="text">Subtotal</span><span className="price">${ingredientSubtotal.toFixed(2)}</span></div>
                    <div className="summary-item"><span className="text">Discount</span><span className="price">%{Discount}</span></div>
                    <div className="summary-item"><span className="text">Shipping</span><span className="price">${Shipping}</span></div>
                    <div className="summary-item"><span className="text">Total</span><span className="price">${(ingredientSubtotal-((Discount*ingredientSubtotal)/100)+Shipping).toFixed(2)}</span></div>
                    <button type="button" className="" onClick={makeOrder}>Checkout</button>
                </div>
            </div>}
            {orderSucss && <div className='Upload-Success-div'>
                <FcCheckmark className="checkmarkIcon" size={100} />
                <h2 className="Success__title">Order Successful!</h2>
                <p className="Success__message">Your Order has been Successful. You will receive an invoice by email shortly.</p>
            </div>}
        </div>
    )

}

export default Cart