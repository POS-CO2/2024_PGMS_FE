import * as navStyles from "./assets/css/navigation.css"; 
import React from "react";
import Title from "./Title";
import Footer from "./Footer";
import MenuList from "./MenuList";
export default function Navigation({ menus, onMenuClick }){

    return(
        <div className={navStyles.navigation_container}>
            <Title/>
            <MenuList menus={menus} onMenuClick={onMenuClick}/>
            <Footer/>
        </div>
    );  
}