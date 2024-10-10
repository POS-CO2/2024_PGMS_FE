import React, { useState, useEffect, useRef } from "react";
import * as chatStyles from './assets/css/chat.css'
import { CampaignTwoTone, ChatOutlined, Close, Person } from "@mui/icons-material";
import { Avatar, Badge, IconButton } from "@mui/material";
import UserList from "./chat/UserList";
import ChatList from "./chat/ChatList";
import Chatting from "./chat/Chatting";
import axiosInstance from "./utils/AxiosInstance";

export default function Chat({ handleCloseClick, totCnt }) {
    const [status, setStatus] = useState("user");
    const [userList, setUserList] = useState([]);
    const [room, setRoom] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [chatContent, setChatContent] = useState([]); 
    const ws = useRef(null);
    const [roomChange, setRoomChange] = useState(false);

    const noticeUser = {
        id: 0,
        userName: "공지사항",
        role: "NOTICE",
        deptCode: "",
    }

    const handleUserClick = (e) => {
        setStatus("user");
    }

    const handleRead = async (id) =>{
        setChatContent(prev=>{
            prev.forEach(e=>{
                if(e.messageId === id){
                    e.readYn = true;
                }
            });
            return [...prev];

        });
    }

    const handleReadAll = ()=>{
        setChatContent(prev=>{
            prev.forEach(e=>{
                e.readYn = true;
            });
            return [...prev];
        });

    };

    const updateChatList = (message) => {
        setRoom((prevRooms) => {
            const updatedRooms = prevRooms.map((room) => {
                if (room.users[0].id === message.senderId || room.users[0].id === message.receiverId) {
                    return {
                        ...room,
                        lastMessage: message.message,
                        lastSentDate: message.sentDate,
                        notReadCnt: message.senderId === me.id ? 0 : room.notReadCnt + 1
                    };
                }
                return room;
            });

            // 새로운 방 생성 체크
            const existingRoom = updatedRooms.find((room) => room.users[0].id === message.senderId || room.users[0].id === message.receiverId);
            if (!existingRoom) {
                const newRoom = {
                    id: message.chatRoomId,
                    users: [{ id: message.senderId === me.id ? message.receiverId : message.senderId, userName: message.senderId === me.id ? message.receiverName : message.senderName }],
                    lastMessage: message.message,
                    lastSentDate: message.sentDate,
                    notReadCnt: message.senderId === me.id ? 0 : 1,
                };
                return [newRoom, ...updatedRooms];
            }

            return updatedRooms;
        });
    };


    const handleChatListClick = () => {
        setChatContent([]);
        setStatus("chat");
    }

    const handleChattingClick = async (e) => {
        setChatUser(e);
        const chatResponse = await axiosInstance.get(`/chat?targetId=${e.id}&messageId=${chatContent.length === 0 ? 4000000000 : chatContent[chatContent.length - 1].messageId}&count=${10}`);
        console.log(chatResponse.data);
        setChatContent(chatResponse.data);
        try {
            if (e.id !== 0){
                const enterPost = await axiosInstance.post(`/chat/enter?targetId=${e.id}`);
                
            }
            setStatus("chatting");
        } catch (error) {
            console.error(error);
        }
        
    }
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
        const realRoomData = updatedRoomData.filter(e => e.users.length !== 0)
        setRoom(realRoomData);
        
    };

    const me = JSON.parse(localStorage.getItem("user"));
    useEffect(() => {
        const fetchUserList = async () => {
            const {data} = await axiosInstance.get(`/sys/user`);
            setUserList(data);
        };
        
        fetchUserList();
        fetchRoom();

    }, []);
        
    const fpUser = userList.filter(e => e.role === 'FP' && e.id !== me.id);
    const hpUser = userList.filter(e => e.role === "HP" && e.id !== me.id);
    const adminUser = userList.filter(e => e.role === "ADMIN" && e.id !== me.id);

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
        else if (data.role === "ADMIN") {
            return <Avatar sx={{ bgcolor: "orange", fontSize:"1.3rem", fontWeight:"bold" }} >관리</Avatar>
        }
        else {
            return <CampaignTwoTone sx={{bgcolor:"rgb(64,64,64)", width:"40px", height:"40px", borderRadius:"50%", color:"white"}}/>
        }
    }

    useEffect(() => {
        ws.current = new WebSocket(`ws://alb-1042622281.ap-northeast-2.elb.amazonaws.com:8080/chat?channelId=${me.id}`);

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    
    },[me.id])
    
    return (
        <div className={chatStyles.main}>
            <div className={chatStyles.menu_bar}> 
                <IconButton onClick={handleUserClick}>
                    {status === "user" ? (
                        <Person fontSize="large" sx={{color: "black"}} />
                    ) : (
                        <Person fontSize="large" sx={{color: "gray"}} />
                    )}
                </IconButton>
                <IconButton onClick={handleChatListClick}>
                    {status === "chat" ? (
                        <ChatOutlined fontSize="large" sx={{color:"black"}} />
                    ) : (
                        <ChatOutlined fontSize="large" sx={{color:"gray"}} />
                    )}
                </IconButton>
            </div>
            <div className={chatStyles.board}>
                <div className={chatStyles.board_header}>
                    <IconButton onClick={handleCloseClick}>
                        <Close />
                    </IconButton>
                </div>
                {
                    status === "user" ? (
                        <UserList UserListIcon={UserListIcon} handleChattingClick={handleChattingClick} noticeUser={noticeUser} fpUser={fpUser} hpUser={hpUser} adminUser={adminUser} me={me} />
                    ) : (
                        status === "chat" ? (
                            <ChatList UserListIcon={UserListIcon} ws={ws.current} handleChattingClick={handleChattingClick} noticeUser={noticeUser} room={room} fetchRoom={fetchRoom} roomChange={roomChange} setRoomChange={setRoomChange}/>
                        ) : (
                            <Chatting UserListIcon={UserListIcon} ws={ws.current} handleChatListClick={handleChatListClick} noticeUser={noticeUser} handleRead={handleRead} handleReadAll={handleReadAll} updateChatList={updateChatList} chatContent={chatContent} fetchRoom={fetchRoom} setChatContent={setChatContent} roomChange={roomChange} setRoomChange={setRoomChange} chatUser={chatUser} me={me}/>
                        )
                    )
                }
            </div>
        </div>
    );
};
