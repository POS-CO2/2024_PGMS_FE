import React from "react";
import * as appStyles from "./assets/css/app.css"
import Header from "./Header";
import MenuList from "./MenuList";
import Favorite from "./Favorite";

export default function AppContainer({children, tabs, handleMenuClick, activeTab, handelTabClick, handleTabClose, dragEnter, dragStart, drop}){
    return(
        <div className={appStyles.app}>
            <Header tabs = {tabs} activeTab={activeTab} handelTabClick={handelTabClick} handleTabClose={handleTabClose} dragStart={dragStart} dragEnter={dragEnter} drop={drop}/>
            <div className="comp">
                {children}
            </div>
            <Favorite handleMenuClick={handleMenuClick}/>
        </div>
        );
}