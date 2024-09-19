import React, { useState } from "react";
import * as chatStyles from './assets/css/chat.css'
import { ChatOutlined, Close, Person, Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import UserList from "./chat/UserList";


export default function Chat({ handleCloseClick }) {
    const [status, setStatus] = useState("user");

    const handleUserClick = () => {
        setStatus("user");
    }

    const handleChatListClick = () => {
        setStatus("chat");
    }

    const user = localStorage.getItem("user");

    
    return (
        <div className={chatStyles.main}>
            <div className={chatStyles.menu_bar}> 
                <IconButton onClick={handleUserClick}>
                    <Person fontSize="large" sx={{color: "gray"}} />
                </IconButton>
                <IconButton onClick={handleChatListClick}>
                    <ChatOutlined fontSize="large" sx={{color:"gray"}} />
                </IconButton>
            </div>
            <div className={chatStyles.board}>
                <div className={chatStyles.board_header}>
                    <IconButton >
                        <Search />
                    </IconButton>
                    <IconButton onClick={handleCloseClick}>
                        <Close />
                    </IconButton>
                </div>
                {
                    status === "user" ? (
                        <UserList />
                    ) : (
                        <div className={chatStyles.chatlist}>
                            chatlist
                        </div>
                    )
                }
            </div>
        </div>
    );
};
