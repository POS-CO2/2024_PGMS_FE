import React, { useState, useEffect } from "react";
import * as chatStyles from './assets/css/chat.css'
import { ChatOutlined, Close, Person, Search } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import UserList from "./chat/UserList";
import ChatList from "./chat/ChatList";
import Chatting from "./chat/Chatting";
import axiosInstance from "./utils/AxiosInstance";

export default function Chat({ handleCloseClick }) {
    const [status, setStatus] = useState("user");
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [userList, setUserList] = useState([]);
    const [room, setRoom] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [chatContent, setChatContent] = useState([]); 

    const handleUserClick = (e) => {
        setStatus("user");
    }

    const handleChatListClick = () => {
        setChatContent([]);
        setStatus("chat");
    }

    const handleChattingClick = async (e) => {
        setChatUser(e);
        const chatResponse = await axiosInstance.get(`/chat?targetId=${e.id}&messageId=${chatContent.length === 0 ? 4000000000 : chatContent[chatContent.length - 1].messageId}&count=${10}`);
        setChatContent(chatResponse.data);
        try {
            const enterPost = await axiosInstance.post(`/chat/enter?targetId=${e.id}`);
            setStatus("chatting");
        } catch (error) {
            console.error(error);
        }
        
        // 가장 마지막에 처리 채팅으로 넘어감
        
    }
    const me = JSON.parse(localStorage.getItem("user"));
    useEffect(() => {
        const fetchUserList = async () => {
            const {data} = await axiosInstance.get(`/sys/user`);
            setUserList(data);
        };
        const fetchRoom = async () => {
            const roomResponse = await axiosInstance.get(`/chat/room`);
            const roomData = roomResponse.data;

            const updatedRoomData = roomData.map((room) => {
                const filteredUsers = room.users.filter((user) => user.id !== me.id); // localStorage의 user.id와 일치하지 않는 사용자들만 남기기
                return {
                    ...room,
                    users: filteredUsers // 필터링된 users를 room에 업데이트
                };
            });

            setRoom(updatedRoomData);
            
        };

        fetchUserList();
        fetchRoom();
    }, []);
    

    const fpUser = userList.filter(e => e.role === 'FP');
    const hpUser = userList.filter(e => e.role === "HP");
    const adminUser = userList.filter(e => e.role === "ADMIN");

    const UserListIcon = ({data}) => {
        if (!data) {
            return <></>;
        }
        if (data.role === "FP") {
            return <Avatar sx={{ bgcolor: "rgb(14, 170, 0)", fontSize:"1rem", fontWeight:"bold" }} >현장</Avatar>
        }
        else if (data.role === "HP") {
            return <Avatar sx={{ bgcolor: "rgb(74, 122, 230)", fontSize:"1rem", fontWeight:"bold" }} >본사</Avatar>
        }
        else {
            return <Avatar sx={{ bgcolor: "orange", fontSize:"1.3rem", fontWeight:"bold" }} >관리</Avatar>
        }
    }
    
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
                        <UserList UserListIcon={UserListIcon} handleChattingClick={handleChattingClick} fpUser={fpUser} hpUser={hpUser} adminUser={adminUser} me={me} />
                    ) : (
                        status === "chat" ? (
                            <ChatList UserListIcon={UserListIcon} handleChattingClick={handleChattingClick} room={room}/>
                        ) : (
                            <Chatting UserListIcon={UserListIcon} handleChatListClick={handleChatListClick} chatContent={chatContent} setChatContent={setChatContent} chatUser={chatUser} me={me}/>
                        )
                        
                    )
                }
            </div>
        </div>
    );
};
