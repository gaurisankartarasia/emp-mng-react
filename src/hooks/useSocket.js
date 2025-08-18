import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { toast } from 'sonner'; // For popup notifications

export const useSocket = (userId) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]); // In a real app, this might come from the server
    const [newMessage, setNewMessage] = useState(null);
    const [unreadCounts, setUnreadCounts] = useState({});

    useEffect(() => {
        if (!userId) return;

        // Establish the connection, passing the userId for authentication
        const newSocket = io('http://localhost:2025', { // Your backend URL
            auth: { userId }
        });

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            setSocket(newSocket);
        });

        // Listen for incoming messages
        newSocket.on('receiveMessage', (message) => {
            setNewMessage(message);
            
            // Increment unread count for the sender
            setUnreadCounts(prev => ({
                ...prev,
                [message.sender_id]: (prev[message.sender_id] || 0) + 1,
            }));

            // Show a popup toast notification
            toast.message(`New message from ${message.sender_name || 'a user'}`, {
                description: message.content,
            });
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setSocket(null);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [userId]);

    const sendMessage = useCallback((receiverId, content) => {
        if (socket) {
            socket.emit('sendMessage', { receiverId, content });
        }
    }, [socket]);

    const markAsRead = useCallback((senderId) => {
        setUnreadCounts(prev => {
            const newCounts = { ...prev };
            delete newCounts[senderId];
            return newCounts;
        });
    }, []);

    return { socket, sendMessage, newMessage, onlineUsers, unreadCounts, markAsRead };
};