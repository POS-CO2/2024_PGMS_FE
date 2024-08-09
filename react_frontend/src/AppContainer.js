import React, { cloneElement } from "react";
import * as appStyles from "./assets/css/app.css"
import Header from "./Header";
import MenuList from "./MenuList";
import Favorite from "./Favorite";
import Mm from "./components/sysmng/Mm";

export default function AppContainer({children, tabs, user, activeTab, handelTabClick, handleTabClose, dragEnter, dragStart, drop, handleFavClick, fav, handleLogout, menus}){
    return(
        <div className={appStyles.app}>
            <Header 
                tabs = {tabs} 
                activeTab={activeTab} 
                handelTabClick={handelTabClick} 
                handleTabClose={handleTabClose} 
                dragStart={dragStart} 
                dragEnter={dragEnter} 
                drop={drop} 
                handleLogout={handleLogout}
                user={user}
            />
            <div className="comp" style={{boxSizing: "boarder-box"}}>
                {children}
            </div>
            <Favorite handleFavClick={handleFavClick} fav={fav}/>
        </div>
        );
}