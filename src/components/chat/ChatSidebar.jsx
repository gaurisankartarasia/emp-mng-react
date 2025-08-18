import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; 
import { MdAdd } from "react-icons/md";

import { formatDistanceToNow } from 'date-fns';

export const ChatSidebar = ({ conversations, selectedUser, onSelectUser, onNewChat, unreadCounts }) => {
    return (
        <div className="border-r h-full flex flex-col">
            <div className="p-3 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">Conversations</h2>
                <Button variant="ghost" size="default" onClick={onNewChat}>
                    <MdAdd className="h-5 w-5" /> New
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {conversations.map(convo => {
                    const unreadCount = unreadCounts[convo.partner.id] || 0;
                    const isActive = selectedUser?.partner.id === convo.partner.id;

                    return (
                        <div
                            key={convo.partner.id}
                            className={`flex items-center p-3 cursor-pointer hover:bg-muted ${isActive ? 'bg-muted' : ''}`}
                            onClick={() => onSelectUser(convo)}
                        >
                            <Avatar className="h-12 w-12 mr-4">
                                <AvatarImage src={convo.partner.picture} alt={convo.partner.name} />
                                <AvatarFallback>{convo.partner.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <p className="font-semibold">{convo.partner.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(convo.lastMessage.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-sm text-muted-foreground truncate w-48">
                                        {convo.lastMessage.content}
                                    </p>
                                    {unreadCount > 0 && (
                                        <Badge className="h-5 w-5 flex items-center justify-center p-0">{unreadCount}</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};