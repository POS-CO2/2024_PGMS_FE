import React from "react";
import * as headerStyles from "./assets/css/header.css";
import { CssTransition, PopupContext } from "@mui/base";
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { styled } from '@mui/system';
import Tabbar from "./Tabbar";
import { ClassNames } from "@emotion/react";
import { ListItemIcon, Menu, MenuList, Paper, MenuItem } from "@mui/material";
import { Logout } from "@mui/icons-material";



export default function Header({tabs, activeTab, handleTabClose, handelTabClick, dragEnter, dragStart, drop, handleLogout, user}){

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget); // 이벤트 객체에서 현재 타겟을 anchor로 설정
    };

    return(
        <div className={headerStyles.header}>
            <Tabbar tabs = {tabs} activeTab={activeTab} handelTabClick={handelTabClick} handleTabClose={handleTabClose} dragStart={dragStart} dragEnter={dragEnter} drop={drop}/>
                    <div className={headerStyles.header_profile} onClick={handleClick}>
                        <div className={headerStyles.photo}><img src="http://sanriokorea.co.kr/wp-content/themes/sanrio/images/kuromi.png" /></div>
                        <div className={headerStyles.header_name}>{user.userName}
                        </div>
                    </div>
                    {anchorEl && (  // anchorEl이 존재할 때만 Paper 렌더링
                        <Paper sx={{ width: "200px", position: "fixed", top: "50px", right: "0", zIndex: 10 }}>
                            <MenuList>
                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon>
                                        <Logout />
                                    </ListItemIcon>
                                    로그아웃
                                </MenuItem>
                            </MenuList>
                        </Paper>
                    )}
            
        </div>
    );
}
