import React, { useEffect, useState } from 'react';
import * as chatStyles from '../assets/css/chat.css'
import { Badge } from '@mui/material';
import Chatting from './Chatting';
import axiosInstance from '../utils/AxiosInstance';

export default function ChatList({ UserListIcon, handleChattingClick, room }){


    return (
        <div className={chatStyles.chatlist}>
            {/* 채팅 목록 하나 */}
            {room.map(data => (
                <div className={chatStyles.chat_block} key={data.users[0].id} onDoubleClick={() => handleChattingClick(data.users[0])}>
                    <div style={{display:"flex", flexDirection:"row", gap:"1rem"}} >
                        <UserListIcon data={data.users}/>
                        <div>
                            <div style={{fontWeight:"500"}}>
                            {data.users[0].userName}
                            </div>
                            <div style={{fontSize:"0.8rem", color:"grey", textOverflow:"ellipsis", whiteSpace:"nowrap",overflow:"hidden", width:"150px"}}>
                                {data.lastMessage}
                            </div>
                        </div>
                    </div>
                    <div style={{display:"flex", flexDirection:"column", width:"80px", alignItems:"flex-end", gap:"0.5rem"}}>
                        <div style={{fontSize:"0.8rem", color:"grey", textOverflow:"ellipsis"}}>
                        {data.lastSentDate}
                        </div>
                        {data.notReadCnt !== 0 ? ( 
                            <div className={chatStyles.chat_badge}>
                                {data.notReadCnt}
                            </div>
                        ) : (
                            <div className={chatStyles.chat_badge_zero}>
                            </div>    
                        )
                        }
                        
                    </div>
                </div>
            ))}
        </div>
    );
}