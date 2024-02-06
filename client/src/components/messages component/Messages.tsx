import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import './messages.css'
import { message } from '../../interface/typs';
import { MdDelete } from 'react-icons/md';
import { AiOutlineMessage } from "react-icons/ai";
import { dateConvert } from '../../staticData';

function Messages(props: { setNumberOfMessages: Function }) {
    const bearerToken = Cookies.get('token');
    const [messages, setMessages] = useState<message[]>([]);
    const [messagesDitails, setMessagesDitails] = useState<Record<string, string[]>>({});
    const [validetionValues, setValidetionValues] = useState<{quentity:boolean | string,price:boolean | string, allData:boolean | string}>({quentity:false,price:false,allData:false});
    
    useEffect(() => {
        props.setNumberOfMessages(messages.length);
        fetch("http://127.0.0.1:3005/messages", {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${bearerToken}`
            },
        })
            .then(messagesDataStr => { return messagesDataStr.json() })
            .then(messagesDataObj => {
                setMessages(messagesDataObj.messages);
                setMessagesDitails(messagesDataObj.messagesDitails);
            })
    }, []);

    const deleteIngredient = async (messageId: number, ingredient: string) => {

        await fetch("http://127.0.0.1:3005/messages/ingredient", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${bearerToken}`
            },
            body: JSON.stringify({ ingredient, messageId }),
        }).then(dataStr => { return dataStr.json() })
            .then(dataObj => {
                setMessagesDitails(dataObj.messagesDitails)
                setMessages(dataObj.messages);
            });
    };


    const addIngredientToInventory = async (IngredientName: string, messageId: number, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const targetElement = e.target as HTMLElement;
        
        let Quantity = (targetElement.parentNode?.childNodes[1] as HTMLInputElement).value;
        let Price = (targetElement.parentNode?.childNodes[2] as HTMLInputElement).value;
        if(Quantity==="" && Price===""){
            setValidetionValues({allData:"Please provide price and quentity",price:false,quentity:false})
            return
        } 
        if(Quantity==="" || Quantity==="0"){
            setValidetionValues({quentity:"Please provide quentity",price:false,allData:false})
            return;
        }
         if( Price==="" || Price==="0"){
            setValidetionValues({price:"Please provide price",quentity:false,allData:false})
            return
        }
        setValidetionValues({price:false,quentity:false,allData:false})

        try {
            await fetch('http://127.0.0.1:3005/messages/addToInventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${bearerToken}`,
                },
                body: JSON.stringify({ IngredientName, Quantity, Price }),
            });
        } catch (error) {
            console.error('Error updating inventory:', error);
        }
        (targetElement.parentNode?.childNodes[1] as HTMLInputElement).value = "";
        (targetElement.parentNode?.childNodes[2] as HTMLInputElement).value = "";
        deleteIngredient(messageId, IngredientName);
    }

    return (
        <div className='messagesBody'>
            {messages.length === 0 ?
                <div className='NoMessagesDiv'>
                <AiOutlineMessage size={150} />
                <h1>You Have No Any Messages</h1>
                </div>
                : <div className='mesaages-div'>
                    <div className='mesaages-top-Row'>
                        <div className='message-item1'>Message Id</div>
                        <div className='message-item1'>User Name</div>
                        <div className='message-item1'>Message Date</div>
                        <div className='message-item2'>ingredients</div>
                    </div>
                    {messages.map((message: message,index) => {
                        return <div key={index} className='row'>
                            <div className='message-row'>
                            <div className='message-item1'>{message.id}</div>
                            <div className='message-item1'>{message.username}</div>
                            <div className='message-item1'>{dateConvert(message.messageDate).date} {dateConvert(message.messageDate).time}</div>
                            <div className='message-item2'>
                                {messagesDitails[message.id] && messagesDitails[message.id].map((ingredient, idx) => {
                                    return <div key={idx} className='ingredient-div '>
                                        <div className='ingredient-item'>{ingredient}</div>
                                        <input className='QuantityInput' type="number" name='Quantity' placeholder='Quantity' />
                                        <input className='PriceInput' type="number" name='Price' placeholder='Price' />
                                        {/* <div className='btn-div ingredient-item'> */}
                                        <button className='ingredient-item ingredient-btn' onClick={(e) => { addIngredientToInventory(ingredient, message.id, e) }}>add</button>
                                        <MdDelete size={25} className='ingredient-item ingredient-btn' onClick={() => { deleteIngredient(message.id, ingredient) }} />
                                        {/* </div> */}
                                    </div>
                                })}
                            </div>
                            </div>
                            {(validetionValues.price && <div className='validationInventoryDiv'>{validetionValues.price}</div>) ||
                             (validetionValues.quentity && <div className='validationInventoryDiv'>{validetionValues.quentity}</div>) ||
                              (validetionValues.allData && <div className='validationInventoryDiv'>{validetionValues.allData}</div>)
                             }
                        </div>
                    })}
                </div>}
        </div>

    )
}

export default Messages