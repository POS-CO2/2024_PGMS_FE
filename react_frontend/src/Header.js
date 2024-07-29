import React from "react";
import * as headerStyles from "./assets/css/header.css";
import Tabbar from "./Tabbar";

export default function Header({tabs, activeTab, handleTabClose, handelTabClick}){


    return(
        <div className={headerStyles.header}>
            <Tabbar tabs = {tabs} activeTab={activeTab} handelTabClick={handelTabClick} handleTabClose={handleTabClose}/>
            <div className={headerStyles.header_profile}>
                
                <div className={headerStyles.photo}><img src="http://sanriokorea.co.kr/wp-content/themes/sanrio/images/kuromi.png" /></div>
                <div className={headerStyles.header_name}>{"임병준"}</div>

            </div>
            
        </div>
    );
}