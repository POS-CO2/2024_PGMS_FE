import React from "react";
import * as headerStyles from "./assets/css/header.css";
import { Dropdown } from "@mui/base/Dropdown";
import { MenuButton, Menu, MenuItem } from "@mui/base";
import Tabbar from "./Tabbar";

export default function Header({tabs, activeTab, handleTabClose, handelTabClick, dragEnter, dragStart, drop, handleLogout}){


    return(
        <div className={headerStyles.header}>
            <Tabbar tabs = {tabs} activeTab={activeTab} handelTabClick={handelTabClick} handleTabClose={handleTabClose} dragStart={dragStart} dragEnter={dragEnter} drop={drop}/>
            <Dropdown>
                <MenuButton>
                    <div className={headerStyles.header_profile} onClick={() => handleLogout()}>
                        <div className={headerStyles.photo}><img src="http://sanriokorea.co.kr/wp-content/themes/sanrio/images/kuromi.png" /></div>
                        <div className={headerStyles.header_name}>{"임병준"}</div>
                    </div>
                </MenuButton>
                <Menu >
                    <MenuItem>Log out</MenuItem>
                </Menu>
            </Dropdown>
            
        </div>
    );
}