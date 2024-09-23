import React, { useEffect, useState } from 'react';
import * as chatStyles from '../assets/css/chat.css'

export default function ChatList({ UserListIcon, handleChattingClick, room, fetchRoom, roomChange, setRoomChange, ws }){

    useEffect(() => {
        if (!ws) return;


        const handleMessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            if (message.type === 'CHAT') {
                // updateChatList(message)
                fetchRoom();
            }
            else {
                return ;
            }
        };

        ws.addEventListener('message', handleMessage);

        return () => {
            ws.removeEventListener('message', handleMessage)
        };
    }, [ws]);

    useEffect(()=> {
        fetchRoom();
    },[])

    return (
        <div className={chatStyles.chatlist}>
            {room.map(data => (
                <div className={chatStyles.chat_block} onDoubleClick={() => handleChattingClick(data.users[0])}>
                    <div style={{display:"flex", flexDirection:"row", gap:"1rem"}} >
                        <UserListIcon data={data.users[0]}/>
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
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}