import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import './ManagementAccontInventory.css'
import { inventoryIngredient } from '../../interface/typs';
import { MdDelete } from 'react-icons/md';

function ManagementAccontInventory() {
    const bearerToken = Cookies.get('token');
    const [inventory, setInventory] = useState<inventoryIngredient[]>([]);

    const handleQuantityPriceChange = async (curr: inventoryIngredient, e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        // Update the quantity in the local state
        const valueAsNumber = +e.target.value;

        const updatedInventory: inventoryIngredient[] = inventory.map((item: inventoryIngredient) => {
            if (type === "Quantity") {
                if (item.id === curr.id) {
                    return { ...item, Quantity: valueAsNumber };
                }
            } else {
                if (item.id === curr.id) {
                    return { ...item, Price: valueAsNumber };
                }
            }
            return item;
        });
        setInventory(updatedInventory);
        try {
            await fetch('http://127.0.0.1:3005/management/Inventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${bearerToken}`,
                },
                body: JSON.stringify({ updatedInventory: updatedInventory, itemId: curr.id }),
            });
        } catch (error) {
            console.error('Error updating inventory:', error);
        }
    };

    useEffect(() => {
        fetch("http://127.0.0.1:3005/management/Inventory", {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${bearerToken}`
            },
        })
            .then(dataStr => { return dataStr.json() })
            .then(dataObj => {
                setInventory(dataObj);
            })
    }, []);

    const addIngredientToInventory = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const newIngredientName = (document.querySelector(".IngredientName") as HTMLInputElement).value;
        const newQuantity = (document.querySelector(".Quantity") as HTMLInputElement).value;
        const newPrice = (document.querySelector(".Price") as HTMLInputElement).value;

        const updatedInventory: inventoryIngredient[] = [...inventory, {
            IngredientName: newIngredientName,
            Price: +newPrice,
            Quantity: +newQuantity,
            id: inventory.length + 1
        }];
        setInventory(updatedInventory);

        (document.querySelector(".IngredientName") as HTMLInputElement).value = '';
        (document.querySelector(".Quantity") as HTMLInputElement).value = '';
        (document.querySelector(".Price") as HTMLInputElement).value = '';
        try {
            // Send updated inventory data to the server
            await fetch('http://127.0.0.1:3005/management/addToInventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${bearerToken}`,
                },
                body: JSON.stringify(updatedInventory[updatedInventory.length - 1]),
            });
        } catch (error) {
            console.error('Error updating inventory:', error);
        }
    }

    const deleteFromInventory = async (ingredientId: number) => {
        try {
            await fetch('http://127.0.0.1:3005/management/Inventory', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${bearerToken}`,
                },
                body: JSON.stringify({ ingredientId }),
            }).then(inventoryStr=>{return inventoryStr.json()})
            .then(inventoryObj=>{
                setInventory(inventoryObj);
            })
        } catch (error) {
            console.error('Error updating inventory:', error);
        }
    }


    return (
        <div className='inventoryBody'>
            <div className='inventoryTable'>
                <div className='top-Row'>
                    <div className='item'>Ingredient</div>
                    <div className='item'>Quantity</div>
                    <div className='item'>Price</div>
                </div>
                {inventory.map((curr: inventoryIngredient) => {
                    return <div key={curr.id} className='inventory-row'>
                        <div className='item'>{curr.IngredientName}</div>
                        <div className='item'><input type="number" value={curr.Quantity} onChange={(e) => handleQuantityPriceChange(curr, e, "Quantity")} /></div>
                        <div className='item'><input type="number" value={curr.Price} onChange={(e) => handleQuantityPriceChange(curr, e, "Price")} /></div>
                        <MdDelete size={10} className='deleteFromInventoryIcon' onClick={() => deleteFromInventory(curr.id)}/>
                    </div>
                })
                }


            </div>
            <div className='bottom-Row'>
                <div className='bottom-Row-item '><input className='IngredientName' type="text" name='IngredientName' placeholder='IngredientName' /></div>
                <div className='bottom-Row-item '><input className='Quantity' type="number" name='Quantity' placeholder='Quantity' /></div>
                <div className='bottom-Row-item '><input className='Price' type="number" name='Price' placeholder='Price' /></div>
            </div>
            <div className='addIngredientbtnDiv'>
                <button className='add-ingredient-btn' onClick={(e) => { addIngredientToInventory(e) }}>add ingredient</button>
            </div>
        </div>
    )
}

export default ManagementAccontInventory