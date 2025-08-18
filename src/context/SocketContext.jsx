import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { toast } from 'sonner';
import useAuth from '@/hooks/useAuth'; // Your auth hook
import apiClient from '@/api/axiosConfig';

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user?.id) {
            // Fetch initial unread count on login
            apiClient.get('/chat/conversations').then(response => {
                const totalUnread = response.data.reduce((sum, convo) => sum + convo.unreadCount, 0);
                setUnreadCount(totalUnread);
            });
            
            const newSocket = io('http://localhost:2025', {
                auth: { userId: user.id }
            });

            setSocket(newSocket);

            newSocket.on('receiveMessage', (message) => {
                // Increment total unread count
                setUnreadCount(prev => prev + 1);
                
                toast.message(`New message from ${message.sender_name || 'a user'}`, {
                    description: message.content,
                });
            });

            return () => newSocket.disconnect();
        } else {
            // Clean up if user logs out
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [user]);

    const value = {
        socket,
        unreadCount,
        setUnreadCount // Allow components to update the count (e.g., after reading)
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};