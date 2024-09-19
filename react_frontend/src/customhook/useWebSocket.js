import { useState, useEffect } from 'react';

const useWebSocket = (url) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const ws = new WebSocket(url);

        ws.onopen = () => {
            setIsConnected(true);
            console.log('WebSocket connect open');
        };

        ws.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        ws.onclose = () => {
            setIsConnected(false);
            console.log('WebSocket connect close');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [url]);

    const sendMessage = (message) => {
        if (socket && isConnected) {
            socket.send(JSON.stringify(message));
        }
    };

    return { messages, sendMessage, isConnected };
};

export default useWebSocket;