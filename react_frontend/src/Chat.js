import React, { useState } from "react";
import * as chatStyles from './assets/css/chat.css'
import { ChatOutlined, Person } from "@mui/icons-material";
import { IconButton } from "@mui/material";


export default function Chat(params) {
    return (
        <div className={chatStyles.main}>
            <div className={chatStyles.menu_bar}> 
                <IconButton >
                    <Person fontSize="large" sx={{color: "gray"}} />
                </IconButton>
                <IconButton>
                    <ChatOutlined fontSize="large" sx={{color:"gray"}} />
                </IconButton>
            </div>
            <div className={chatStyles.board}>

            </div>
        </div>
    );
};
