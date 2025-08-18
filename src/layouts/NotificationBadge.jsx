import React from 'react';
import { Link } from 'react-router-dom';
import { useSocketContext } from '@/context/SocketContext';
 import { TbMessages } from "react-icons/tb";

import { Badge } from '@/components/ui/badge';

export const NotificationBadge = () => {
    const { unreadCount } = useSocketContext();

    return (
        <Link to="/chat" className="relative p-2">
            <TbMessages className="h-6 w-6" />
            {unreadCount > 0 && (
                <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                >
                    {unreadCount}
                </Badge>
            )}
        </Link>
    );
};