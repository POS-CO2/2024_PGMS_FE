import React from "react";
import * as appStyles from "./assets/css/app.css"
import Header from "./Header";
import MenuList from "./MenuList";

export default function AppContainer({children, tabs, activeTab, handelTabClick, handleTabClose, dragEnter, dragStart, drop}){
    return(
        <div className={appStyles.app}>
            <Header tabs = {tabs} activeTab={activeTab} handelTabClick={handelTabClick} handleTabClose={handleTabClose} dragStart={dragStart} dragEnter={dragEnter} drop={drop}/>
            {children}
        </div>
        );
}