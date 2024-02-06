import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import './ManagementAcoontOreder.css'
import { orderItem } from '../../interface/typs';
import { dateConvert } from '../../staticData';



function ManagementAccontOreder() {
    const bearerToken = Cookies.get('token');
    const [allOrder, setAllOrder] = useState<orderItem[]>([]);

    const groupedOrdersById: { [orderId: string]: orderItem[] } = {};


    useEffect(() => {
        fetch("http://127.0.0.1:3005/management/order", {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${bearerToken}`
            },
        })
            .then(dataStr => { return dataStr.json() })
            .then(dataObj => {
                setAllOrder(dataObj);
            })
    }, []);

    allOrder.forEach((orderItem: orderItem) => {
        if (!groupedOrdersById[orderItem.id]) {
            groupedOrdersById[orderItem.id] = [];
        }
        groupedOrdersById[orderItem.id].push(orderItem);
    });



    return (
        <div className='ordersDiv'>
            <div className='order-top-Row'>
                <div className='orderItem'>orderId</div>
                <div className='orderItem'>customerId</div>
                <div className='orderItem'>orderDate</div>
                <div className='ingredientsQuentityDiv orderItem'>
                    <div >ingredients / quantity</div>
                {/* <div className='orderItem'>quantity</div> */}
                </div>
                
            </div>
            {Object.entries(groupedOrdersById).reverse().map(([orderId, orderItems]: [string, orderItem[]]) => {//orderItems[0].orderDate
                return <div key={orderId} className='order-Row'>
                    <div className='orderItem'>{orderItems[0].id}</div>
                    <div className='orderItem'>{orderItems[0].customerId}</div>
                    <div className='orderItem'>{dateConvert(orderItems[0].orderDate).date} {dateConvert(orderItems[0].orderDate).time}</div>
                    <div className=' orderItem'>
                        {orderItems.map((curritem: orderItem,index) => {
                            return <div className='ingredientsQuentityDiv' key={curritem.IngredientName}><div>{curritem.IngredientName}</div><div>{orderItems[index].quantity}</div></div>
                        })}
                    </div>
                    {/* <div className=' orderItem'>
                        {orderItems.map((curritem: orderItem) => {
                            return <li key={curritem.IngredientName}>{curritem.quantity}</li>
                        })}
                    </div> */}
                    </div>
            })}

        </div>
    )
}

export default ManagementAccontOreder