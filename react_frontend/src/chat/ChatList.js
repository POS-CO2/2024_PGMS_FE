import React, { useState } from 'react';
import * as chatStyles from '../assets/css/chat.css'
import { Badge } from '@mui/material';

export default function ChatList({ UserListIcon }){

    const temp = JSON.parse(localStorage.getItem("user"));

    return (
        <div className={chatStyles.chatlist}>
            {/* 채팅 목록 하나 */}
            <div className={chatStyles.chat_block}>
                <div style={{display:"flex", flexDirection:"row", gap:"1rem"}}>
                    <UserListIcon data={temp}/>
                    <div>
                        <div style={{fontWeight:"500"}}>
                        {temp.userName}
                        </div>
                        <div style={{fontSize:"0.8rem", color:"grey"}}>
                            hello
                        </div>
                    </div>
                </div>
                <div style={{display:"flex", flexDirection:"column", width:"80px", alignItems:"flex-end", gap:"0.5rem"}}>
                    <div style={{fontSize:"0.8rem", color:"grey"}}>
                    오전 10:16
                    </div>
                    <div className={chatStyles.chat_badge}>
                        3
                    </div>
                </div>
            </div>
            {/* 여기까지 */}
            <div className={chatStyles.chat_block}>
                <div style={{display:"flex", flexDirection:"row", gap:"1rem"}}>
                    <UserListIcon data={temp}/>
                    <div>
                        <div style={{fontWeight:"500"}}>
                        {temp.userName}
                        </div>
                        <div style={{fontSize:"0.8rem", color:"grey"}}>
                            hello
                        </div>
                    </div>
                </div>
                <div style={{display:"flex", flexDirection:"column", width:"80px", alignItems:"flex-end", gap:"0.5rem"}}>
                    <div style={{fontSize:"0.8rem", color:"grey"}}>
                    오전 10:16
                    </div>
                    <div className={chatStyles.chat_badge}>
                        3
                    </div>
                </div>
            </div>
            <div className={chatStyles.chat_block}>
                <div style={{display:"flex", flexDirection:"row", gap:"1rem"}}>
                    <UserListIcon data={temp}/>
                    <div>
                        <div style={{fontWeight:"500"}}>
                        {temp.userName}
                        </div>
                        <div style={{fontSize:"0.8rem", color:"grey"}}>
                            hello
                        </div>
                    </div>
                </div>
                <div style={{display:"flex", flexDirection:"column", width:"80px", alignItems:"flex-end", gap:"0.5rem"}}>
                    <div style={{fontSize:"0.8rem", color:"grey"}}>
                    오전 10:16
                    </div>
                    <div className={chatStyles.chat_badge}>
                        3
                    </div>
                </div>
            </div>
            <div className={chatStyles.chat_block}>
                <div style={{display:"flex", flexDirection:"row", gap:"1rem"}}>
                    <UserListIcon data={temp}/>
                    <div>
                        <div style={{fontWeight:"500"}}>
                        {temp.userName}
                        </div>
                        <div style={{fontSize:"0.8rem", color:"grey"}}>
                            hello
                        </div>
                    </div>
                </div>
                <div style={{display:"flex", flexDirection:"column", width:"80px", alignItems:"flex-end", gap:"0.5rem"}}>
                    <div style={{fontSize:"0.8rem", color:"grey"}}>
                    오전 10:16
                    </div>
                    <div className={chatStyles.chat_badge}>
                        3
                    </div>
                </div>
            </div>
            <div className={chatStyles.chat_block}>
                <div style={{display:"flex", flexDirection:"row", gap:"1rem"}}>
                    <UserListIcon data={temp}/>
                    <div>
                        <div style={{fontWeight:"500"}}>
                        {temp.userName}
                        </div>
                        <div style={{fontSize:"0.8rem", color:"grey"}}>
                            hello
                        </div>
                    </div>
                </div>
                <div style={{display:"flex", flexDirection:"column", width:"80px", alignItems:"flex-end", gap:"0.5rem"}}>
                    <div style={{fontSize:"0.8rem", color:"grey"}}>
                    오전 10:16
                    </div>
                    <div className={chatStyles.chat_badge}>
                        3
                    </div>
                </div>
            </div>
            <div className={chatStyles.chat_block}>
                <div style={{display:"flex", flexDirection:"row", gap:"1rem"}}>
                    <UserListIcon data={temp}/>
                    <div>
                        <div style={{fontWeight:"500"}}>
                        {temp.userName}
                        </div>
                        <div style={{fontSize:"0.8rem", color:"grey"}}>
                            hello
                        </div>
                    </div>
                </div>
                <div style={{display:"flex", flexDirection:"column", width:"80px", alignItems:"flex-end", gap:"0.5rem"}}>
                    <div style={{fontSize:"0.8rem", color:"grey"}}>
                    오전 10:16
                    </div>
                    <div className={chatStyles.chat_badge}>
                        3
                    </div>
                </div>
            </div>
            <div className={chatStyles.chat_block}>
                <div style={{display:"flex", flexDirection:"row", gap:"1rem"}}>
                    <UserListIcon data={temp}/>
                    <div>
                        <div style={{fontWeight:"500"}}>
                        {temp.userName}
                        </div>
                        <div style={{fontSize:"0.8rem", color:"grey"}}>
                            hello
                        </div>
                    </div>
                </div>
                <div style={{display:"flex", flexDirection:"column", width:"80px", alignItems:"flex-end", gap:"0.5rem"}}>
                    <div style={{fontSize:"0.8rem", color:"grey"}}>
                    오전 10:16
                    </div>
                    <div className={chatStyles.chat_badge}>
                        3
                    </div>
                </div>
            </div>
            <div className={chatStyles.chat_block}>
                <div style={{display:"flex", flexDirection:"row", gap:"1rem"}}>
                    <UserListIcon data={temp}/>
                    <div>
                        <div style={{fontWeight:"500"}}>
                        {temp.userName}
                        </div>
                        <div style={{fontSize:"0.8rem", color:"grey"}}>
                            hello
                        </div>
                    </div>
                </div>
                <div style={{display:"flex", flexDirection:"column", width:"80px", alignItems:"flex-end", gap:"0.5rem"}}>
                    <div style={{fontSize:"0.8rem", color:"grey"}}>
                    오전 10:16
                    </div>
                    <div className={chatStyles.chat_badge}>
                        4
                    </div>
                </div>
            </div>
            <div className={chatStyles.chat_block}>
                <div style={{display:"flex", flexDirection:"row", gap:"1rem"}}>
                    <UserListIcon data={temp}/>
                    <div>
                        <div style={{fontWeight:"500"}}>
                        {temp.userName}
                        </div>
                        <div style={{fontSize:"0.8rem", color:"grey"}}>
                            hello
                        </div>
                    </div>
                </div>
                <div style={{display:"flex", flexDirection:"column", width:"80px", alignItems:"flex-end", gap:"0.5rem"}}>
                    <div style={{fontSize:"0.8rem", color:"grey"}}>
                    오전 10:16
                    </div>
                    <div className={chatStyles.chat_badge}>
                        3
                    </div>
                </div>
            </div>
            <div className={chatStyles.chat_block}>
                <div style={{display:"flex", flexDirection:"row", gap:"1rem"}}>
                    <UserListIcon data={temp}/>
                    <div>
                        <div style={{fontWeight:"500"}}>
                        {temp.userName}
                        </div>
                        <div style={{fontSize:"0.8rem", color:"grey"}}>
                            hello
                        </div>
                    </div>
                </div>
                <div style={{display:"flex", flexDirection:"column", width:"80px", alignItems:"flex-end", gap:"0.5rem"}}>
                    <div style={{fontSize:"0.8rem", color:"grey"}}>
                    오전 10:16
                    </div>
                    <div className={chatStyles.chat_badge}>
                        3
                    </div>
                </div>
            </div>
            <div className={chatStyles.chat_block}>
                <div style={{display:"flex", flexDirection:"row", gap:"1rem"}}>
                    <UserListIcon data={temp}/>
                    <div>
                        <div style={{fontWeight:"500"}}>
                        {temp.userName}
                        </div>
                        <div style={{fontSize:"0.8rem", color:"grey"}}>
                            hello
                        </div>
                    </div>
                </div>
                <div style={{display:"flex", flexDirection:"column", width:"80px", alignItems:"flex-end", gap:"0.5rem"}}>
                    <div style={{fontSize:"0.8rem", color:"grey"}}>
                    오전 10:16
                    </div>
                    <div className={chatStyles.chat_badge}>
                        3
                    </div>
                </div>
            </div>
        </div>
    );
}