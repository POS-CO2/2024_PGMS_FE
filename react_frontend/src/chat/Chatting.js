import React, { useEffect, useRef, useState } from "react";
import * as chatStyles from '../assets/css/chat.css'
import { ArrowBackIosNew, ArrowDownward, Send } from "@mui/icons-material";
import { Chip, CircularProgress, Divider, Fab, IconButton, Snackbar } from "@mui/material";
import { ConfigProvider, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import axiosInstance from "../utils/AxiosInstance";
import {useInView} from 'react-intersection-observer';

export default function Chatting({ UserListIcon ,handleChatListClick, chatUser, me, chatContent, setChatContent, handleRead,handleReadAll, ws, fetchRoom, roomChange, setRoomChange, updateChatList}) {

    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);

    const { ref: sentinelRef, inView} = useInView({
        threshold: 0,
        triggerOnce: false,
    })

    const loadMoreMessages = async () => {
        if (!isLoading && chatContent.length > 0) {
            setIsLoading(true);
            try{
                const lastMessageId = chatContent[chatContent.length - 1].messageId;
                const response = await axiosInstance.get(`/chat?targetId=${chatUser.id}&messageId=${lastMessageId}&count=10`);
                const newMessages = response.data;

                if (newMessages.length > 0) {
                    setChatContent((prevContent) => [...prevContent, ...newMessages]);
                }
            } catch(error) {
                console.error(error);
            }
            setIsLoading(false);
        }
    }


    const handleSend = async () => {
        if (text.trim()) {
            const formData = {
                receiverId : chatUser.id,
                message : text,
            }
            try {
                const sendMessage = await axiosInstance.post(`/chat`, formData);
                console.log('Message sent:', text);
                if (sendMessage.data) {
                    ws.send(JSON.stringify(formData));  // WebSocket으로 메시지를 전송
                    console.log('Message sent via WebSocket:', formData);
                    setText('');
                    setRoomChange(!roomChange);
                    await fetchRoom();
                } 
            } catch (error) {
                console.error(error);
            }
        }
    };
    const handleKeyPress = (e) => {
        if (e.isComposing || e.keyCode === 229) return; 
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (text.trim()) { 
                handleSend();
            }
        }
    };

    const handleScroll = () => {
        const container = chatContainerRef.current;
        if (container) {
            const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 200;
            setShowScrollToBottom(!isAtBottom);  
        }
    };

    const scrollToBottom = () => {
        const container = chatContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;   
            setShowScrollToBottom(false);  
        }
    };

    useEffect(() => {
        const container = chatContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [chatContent]);

    const markAsRead = async (messageId) => {
        try {
            await axiosInstance.post(`/chat/check?objectId=${messageId}`);
        } catch (error) {
            console.error('Failed to mark message as read:', error);
        }
    };

    useEffect(() => {
        if (inView) {
            loadMoreMessages();
        }
    }, [inView]);

    useEffect(() => {
        if (!ws) return;


        const handleMessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            if(message.type === 'READ'){
                handleRead(message.messageId);
            }
            else if (message.type === 'READ_ALL'){
                handleReadAll();
            }
            else if (message.type === 'KEYBOARD'){
                
            }
            else if (message.type === 'CHAT') {
                // updateChatList(message)
                setChatContent((prevContent) => [message, ...prevContent]);
                if (message.senderId !== me.id) markAsRead(message.id);
            }
            else {
                return ;
            }
        };

        ws.addEventListener('message', handleMessage);

        return () => {
            ws.removeEventListener('message', handleMessage)
        };
    }, [ws, me]);


    return (
        <div className={chatStyles.chatting}>
            <div className={chatStyles.chatting_header}>
                <div style={{display:"flex" ,flexDirection:"row", alignItems:"center", gap:"0.5rem", fontSize:"1rem", fontWeight:"500"}}>
                    <IconButton onClick={handleChatListClick}>
                        <ArrowBackIosNew />
                    </IconButton>
                    <UserListIcon data={chatUser} />
                    <div>
                        {chatUser.userName}
                    </div>
                </div>
                <div style={{paddingRight:"0.5rem"}}>
                    <Chip label={chatUser.deptCode} variant='outlined' />
                </div>
            </div>
            <Divider variant="middle" />
            <div className={chatStyles.chatting_content} ref={chatContainerRef}>
                {showScrollToBottom && (
                    <Fab 
                        size="small" 
                        onClick={scrollToBottom} 
                        style={{position: 'fixed', bottom: '120px', right: '16px', backgroundColor:"rgb(14,170,0)"}}>
                        <ArrowDownward sx={{color:"white"}}/>
                    </Fab>
                )}
                {chatContent.map((data, idx) => (
                    <div style={{display:"flex", flexDirection:"row", alignItems:"flex-end"}}>
                        <div key={idx} className={data.senderId === me.id ? chatStyles.mymessage : chatStyles.targetmessage} style={{position:"relative"}}>
                            {data.message}
                            {!data.readYn && <div style={{position: "absolute",bottom: "0", left:"-1rem", color:"rgb(14, 170, 0)"}}>1</div>}
                        </div>
                    </div>
                ))}
                {/* {isLoading && <CircularProgress color="success" sx={{margin:"0 auto"}}/>} */}
                <div ref={sentinelRef}></div>
            </div>
            <Divider variant="middle" />
            <div className={chatStyles.chatting_input}>
                <ConfigProvider theme={{token:{
                    fontFamily:"SUITE-Regular"
                }}}>
                    <div style={{display:"flex", flexDirection:"row", width:"100%", height:"100%", gap:"1rem", margin:"0.3rem 0.5rem", justifyContent:"space-between", alignItems:"center"}}>
                        <TextArea 
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        placeholder="보낼 메시지를 입력하세요." 
                        onKeyDown={handleKeyPress}
                        autoSize={{
                            minRows: 2,
                            maxRows: 3,
                        }} />
                        <IconButton onClick={handleSend}>
                            <Send sx={{color:"#6cbb66"}} />
                        </IconButton>
                    </div>
                </ConfigProvider>
            </div>
        </div>
    );
};
