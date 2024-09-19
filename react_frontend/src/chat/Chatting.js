import React, { useEffect, useRef, useState } from "react";
import * as chatStyles from '../assets/css/chat.css'
import { ArrowBackIosNew, Send } from "@mui/icons-material";
import { Chip, CircularProgress, Divider, IconButton } from "@mui/material";
import { ConfigProvider, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import axiosInstance from "../utils/AxiosInstance";
import ScrollToBottom from 'react-scroll-to-bottom';
import {useInView} from 'react-intersection-observer';

export default function Chatting({ UserListIcon ,handleChatListClick, chatUser, me, chatContent, setChatContent }) {

    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);

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
                setText('');    
            } catch (error) {
                console.error(error);
            }
            
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { 
            e.preventDefault();
            handleSend(); 
        }
    };

    useEffect(() => {
        if (inView) {
            loadMoreMessages();
        }
    }, [inView]);


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
                            minRows: 4,
                            maxRows: 4,
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
