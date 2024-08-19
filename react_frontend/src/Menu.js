import React,{useState, useEffect} from "react";
import * as menuStyles from "./assets/css/menu.css";
import MenuList from "./MenuList";
import {NavLink} from "react-router-dom";
export default function Menu({menu, onMenuClick, activeTab}){
    const [isOpen,setIsOpen] = useState(false);
    const toggleOpen = ()=>{
        setIsOpen(prev=>!prev);
    };

    const getLocalStorageActiveTab = () => {
        return localStorage.getItem('activeTab') || "/";
    }
     console.log(activeTab);
     console.log(getLocalStorageActiveTab());
     console.log(menu.url);

    useEffect(() => {
        if ((activeTab === menu.url || getLocalStorageActiveTab() === menu.url) && !isOpen && menu.menu.length !== 0) {
            setIsOpen(false);
        }
    }, [activeTab, menu.url]);

    return(
        <div className={
            `
            ${
                menu.level === 1 ? 
                menuStyles.level_1
                : menu.level === 2 ?
                menuStyles.level_2 : 
                menuStyles.level_3
            } ${
                menuStyles.menu
            } ${
                menu.menu.length == 0 ? menuStyles.can_hover : ""
            } ${
                (activeTab === menu.url || getLocalStorageActiveTab() === menu.url)  && menu.url != null ? menuStyles.active : ""
            }
            `
        }>
            {
                menu.url ? <NavLink to={menu.url} onClick={() => {onMenuClick(menu)}}>{menu.name}</NavLink> : <span>{menu.name}</span>
            } 
            {
                menu.menu.length != 0 && !isOpen 
                ? 

                <svg onClick={toggleOpen}width="11" height="11" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 10.5L0.75 20.4593L0.75 0.540708L18 10.5Z" fill="white"/>
                </svg>
                
                :
                menu.menu.length != 0 && isOpen
                ?
                <svg onClick={toggleOpen}width="11" height="11" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 18L0.540707 0.75L20.4593 0.75L10.5 18Z" fill="white"/>
                </svg>

                
                : ""

                
            }
            {
                menu.menu.length != 0
                && 
                isOpen
                &&
                <MenuList menus={menu.menu} onMenuClick={onMenuClick} activeTab={activeTab}/>


            }
        </div>
    );

}