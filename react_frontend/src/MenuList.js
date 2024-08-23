import React from "react";
import * as menuStyles from "./assets/css/menu.css"
import Menu from "./Menu"

export default function MenuList({menus, onMenuClick, activeTab}){

    return(
        <div className={menuStyles.menu_container }>
            {
                menus.map(v=><Menu key={v.name} menu={v} onMenuClick={onMenuClick} activeTab={activeTab}/>)
            }
        
        </div>
    );
}