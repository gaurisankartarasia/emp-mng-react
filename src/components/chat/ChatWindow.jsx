import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';
import { format } from 'date-fns';
import apiClient from '@/api/axiosConfig';

export const ChatWindow = ({ currentUser, selectedUser, onNewMessage, sendMessage }) => {
    const [messages, setMessages] = useState([]);
    const [newMessageContent, setNewMessageContent] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (selectedUser) {
            const fetchMessages = async () => {
                const response = await apiClient.get(`/chat/messages/${selectedUser.partner.id}`);
                setMessages(response.data);
            };
            fetchMessages();
        } else {
            setMessages([]);
        }
    }, [selectedUser]);
    
    useEffect(() => {
        // Add new message to state if it belongs to the current chat
        if (onNewMessage && selectedUser && (onNewMessage.sender_id === selectedUser.partner.id || onNewMessage.receiver_id === selectedUser.partner.id)) {
            setMessages(prev => [...prev, onNewMessage]);
        }
    }, [onNewMessage, selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessageContent.trim()) return;
        
        sendMessage(selectedUser.partner.id, newMessageContent);

        // Add message to our own state immediately for a responsive feel
        const ownMessage = {
            sender_id: currentUser.id,
            receiver_id: selectedUser.partner.id,
            content: newMessageContent,
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, ownMessage]);
        setNewMessageContent('');
    };

    if (!selectedUser) {
        return <div className="flex items-center justify-center h-full text-muted-foreground">Select a conversation to start chatting.</div>;
    }
    
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center p-4 border-b">
                <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={selectedUser.partner.picture} />
                    <AvatarFallback>{selectedUser.partner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">{selectedUser.partner.name}</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex my-2 ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.sender_id === currentUser.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <p>{msg.content}</p>
                            <p className="text-xs mt-1 opacity-75 text-right">{format(new Date(msg.created_at), 'p')}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <Input
                        value={newMessageContent}
                        onChange={(e) => setNewMessageContent(e.target.value)}
                        placeholder="Type a message..."
                        autoComplete="off"
                    />
                    <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
                </form>
            </div>
        </div>
    );
};
