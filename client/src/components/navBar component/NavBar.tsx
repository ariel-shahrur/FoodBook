import React, { useEffect, useState } from 'react'
import './NavBar.css'
import { navItem } from '../../interface/typs';
import { AiOutlineShoppingCart } from "react-icons/ai";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


function NavBar(props: { navItems: any[], isConncted: boolean,isADminConncted: boolean, setIsADminConncted: Function,setIsConncted:Function,numberOfMessages:number, setNumberOfMessages:Function }) {
    const navigate = useNavigate();
    const [isAccountOpen, setIsAccountOpen] = useState(false); 
    const [isManagmentAccountOpen, setIsManagmentAccountOpen] = useState(false);
    const bearerToken = Cookies.get('token');

   if(bearerToken){
    fetch("http://127.0.0.1:3005/messages", {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${bearerToken}`
            },
        })
            .then(messagesDataStr => { return messagesDataStr.json() })
            .then(messagesDataObj => {
                props.setNumberOfMessages(messagesDataObj.messages.length);
            })
   }
        

    const toggleDropdown = (type: string) => {
        if (type === "account") {
            setIsAccountOpen(!isAccountOpen)
        }
        else {
            setIsManagmentAccountOpen(!isManagmentAccountOpen)
        }
    }

    const handleForLogOut = () => {
        Cookies.remove('token');
        Cookies.remove('admin');
        props.setIsConncted(false);
        props.setIsADminConncted(false);
        navigate('/')
      }

    return (
        <div className='NavBarDiv'>
                {props.navItems.map((curr, index) => {
                    if (curr.displayStr === 'favorite' && !props.isConncted) {
                        return;
                    }
                    if (curr.displayStr === 'Home' && props.isConncted) {
                        return;
                    }
                    if (curr.displayStr === 'upload recipe' && !props.isConncted) {
                        return;
                    }
                    if (curr.displayStr === 'Feed' && !props.isConncted) {
                        return;
                    }
                    if (curr.displayStr === 'managment acoount' && !props.isADminConncted) {
                        return;
                    }
                    // if (curr.displayStr === 'messages' && !props.isADminConncted) {
                    //     return;
                    // }
                    if (curr.displayStr === 'account' && !props.isConncted) {
                        return;
                    }
                    if (curr.displayStr === 'Login' && props.isConncted) {
                        return
                    }

                    if (curr.displayStr === 'account' && props.isConncted) {//onMouseEnter={() => toggleDropdown("account")} onMouseLeave={() => toggleDropdown("account")}
                        return <div key={curr.key} className='dropdown' >
                            <button className='dropbtn'>{curr.displayStr}</button>
                            { <div className='dropdown-content'>
                                {curr.subNav.map((subNavItem: navItem) => {
                                    if (subNavItem.displayStr === "Login") {
                                        return <a key={subNavItem.key} className='subNavItem' onClick={handleForLogOut}>Logout</a>
                                    }
                                    return <a key={subNavItem.key} className='subNavItem' href={subNavItem.hrefStr}>{subNavItem.displayStr}</a>
                                })}
                            </div>}
                            </div>
                    }  

                    if (curr.displayStr === 'managment acoount' && props.isADminConncted) {
                        return <div key={curr.key} className='dropdown'>
                            <button className='dropbtn'>{curr.displayStr}</button>
                            { <div className='dropdown-content'>
                                {curr.subNav.map((subNavItem: navItem) => {
                                    return <a key={subNavItem.key} className='subNavItem' href={subNavItem.hrefStr}>{subNavItem.displayStr}</a>
                                })}
                            </div>}
                            </div>
                    }

                    if (curr.displayStr === 'Cart') {
                        if (!props.isConncted) {
                            return;
                        }
                        return <a key={curr.key} className='navBarItem' href={curr.hrefStr}><AiOutlineShoppingCart size={25} /></a>
                    }
                    if (curr.displayStr === 'messages') {
                        if (!props.isADminConncted) {
                            return;
                        }
                        return <a key={curr.key} className='navBarItem' href={curr.hrefStr}>{curr.displayStr} {props.numberOfMessages!==0  && <span className='numberOfMessages'>{props.numberOfMessages}</span>}</a>
                    }
                    return <a key={curr.key} className='navBarItem' href={curr.hrefStr}>{curr.displayStr}</a>
                })}
        </div>
    )
}

export default NavBar