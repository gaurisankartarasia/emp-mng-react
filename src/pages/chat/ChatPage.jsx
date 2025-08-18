// import React, { useState, useEffect } from 'react';
// import { useSocket } from '@/hooks/useSocket';
// import useAuth from '@/hooks/useAuth';
// import apiClient from '@/api/axiosConfig';
// import { ChatSidebar } from '@/components/chat/ChatSidebar';
// import { ChatWindow } from '@/components/chat/ChatWindow';
// import { NewChatModal } from '@/components/chat/NewChatModal'; // Import the new modal
// import { Spinner } from '@/components/ui/spinner';

// const ChatPage = () => {
//     const { user } = useAuth();
//     const { sendMessage, newMessage, unreadCounts, markAsRead } = useSocket(user?.id);
    
//     const [conversations, setConversations] = useState([]);
//     const [selectedConversation, setSelectedConversation] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isNewChatModalOpen, setNewChatModalOpen] = useState(false); // State for the modal

//     useEffect(() => {
//         // ... (fetchConversations logic remains the same)
//         const fetchConversations = async () => {
//             try {
//                 const response = await apiClient.get('/chat/conversations');
//                 setConversations(response.data);
//             } catch (error) {
//                 console.error("Failed to fetch conversations", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         if (user) {
//             fetchConversations();
//         }
//     }, [user]);
    
//     const handleSelectConversation = (conversation) => {
//         setSelectedConversation(conversation);
//         markAsRead(conversation.partner.id);
//     };

//     // This function is called from the NewChatModal
//     const handleStartNewChat = (userToChatWith) => {
//         // Check if a conversation with this user already exists
//         const existingConvo = conversations.find(c => c.partner.id === userToChatWith.id);
//         if (existingConvo) {
//             // If it exists, just select it
//             setSelectedConversation(existingConvo);
//         } else {
//             // If not, create a new temporary conversation object for the UI
//             const newConvo = {
//                 partner: userToChatWith,
//                 lastMessage: { content: "Start a new conversation!", created_at: new Date().toISOString() },
//                 unreadCount: 0
//             };
//             setConversations(prev => [newConvo, ...prev]);
//             setSelectedConversation(newConvo);
//         }
//     };

//     if (isLoading) {
//         return <div className="flex h-screen items-center justify-center"><Spinner /></div>;
//     }
    
//     return (
//         <>
//             <div className="flex h-[calc(100vh-theme-header-height)]">
//                 <div className="w-1/4 min-w-[300px]">
//                     <ChatSidebar 
//                         conversations={conversations}
//                         selectedUser={selectedConversation}
//                         onSelectUser={handleSelectConversation}
//                         unreadCounts={unreadCounts}
//                         onNewChat={() => setNewChatModalOpen(true)} // Open the modal
//                     />
//                 </div>
//                 <div className="flex-1">
//                     <ChatWindow 
//                         currentUser={user}
//                         selectedUser={selectedConversation}
//                         onNewMessage={newMessage}
//                         sendMessage={sendMessage}
//                     />
//                 </div>
//             </div>

//             <NewChatModal
//                 open={isNewChatModalOpen}
//                 onOpenChange={setNewChatModalOpen}
//                 onSelectUser={handleStartNewChat}
//             />
//         </>
//     );
// };

// export default ChatPage;


import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '@/hooks/useSocket';
import useAuth from '@/hooks/useAuth';
import apiClient from '@/api/axiosConfig';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { NewChatModal } from '@/components/chat/NewChatModal';
import { Spinner } from '@/components/ui/spinner';

const ChatPage = () => {
    const { user } = useAuth();
    const { sendMessage, newMessage, unreadCounts, markAsRead } = useSocket(user?.id);
    
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isNewChatModalOpen, setNewChatModalOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const { userId: urlUserId } = useParams(); // 2. Get the userId from the URL

    useEffect(() => {
        const fetchConversationsAndHandleDirectLink = async () => {
            try {
                const response = await apiClient.get('/chat/conversations');
                const convos = response.data;
                setConversations(convos);

                const directUserId = parseInt(urlUserId, 10);
                const initiateWithUserFromState = location.state?.initiateWith;

                // 3. Prioritize URL parameter, then fall back to location state
                const userToInitiate = directUserId ? { id: directUserId } : initiateWithUserFromState;

                if (userToInitiate) {
                    const existingConvo = convos.find(c => c.partner.id === userToInitiate.id);
                    if (existingConvo) {
                        handleSelectConversation(existingConvo);
                    } else {
                        // If the user isn't in existing convos, fetch their details to start a new one
                        try {
                            // Assuming you have an endpoint to get a single employee's basic info
                            const userResponse = await apiClient.get(`/employees/basic/${userToInitiate.id}`);
                            const newConvoPartner = userResponse.data;
                            const newConvo = {
                                partner: newConvoPartner,
                                lastMessage: { content: "Start a new conversation!", created_at: new Date().toISOString() },
                                unreadCount: 0
                            };
                            setConversations(prev => [newConvo, ...prev]);
                            handleSelectConversation(newConvo);
                        } catch (e) {
                            console.error("Could not fetch user to initiate chat", e);
                        }
                    }
                    // Clear location state if it was used
                    if (initiateWithUserFromState) {
                        navigate(location.pathname, { replace: true });
                    }
                }

            } catch (error) {
                console.error("Failed to fetch conversations", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchConversationsAndHandleDirectLink();
        }
    }, [user, urlUserId, location.state]); // Add urlUserId and location.state to dependencies

    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
        markAsRead(conversation.partner.id);
    };

    const handleStartNewChat = (userToChatWith) => {
        const existingConvo = conversations.find(c => c.partner.id === userToChatWith.id);
        if (existingConvo) {
            setSelectedConversation(existingConvo);
        } else {
            const newConvo = {
                partner: userToChatWith,
                lastMessage: { content: "Start a new conversation!", created_at: new Date().toISOString() },
                unreadCount: 0
            };
            setConversations(prev => [newConvo, ...prev]);
            setSelectedConversation(newConvo);
        }
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Spinner /></div>;
    }
    
    return (
        <>
            <div className="flex h-[calc(100vh-theme-header-height)]">
                 <div className="w-1/4 min-w-[300px]">
                    <ChatSidebar 
                        conversations={conversations}
                        selectedUser={selectedConversation}
                        onSelectUser={handleSelectConversation}
                        unreadCounts={unreadCounts}
                        onNewChat={() => setNewChatModalOpen(true)}
                    />
                </div>
                <div className="flex-1">
                    <ChatWindow 
                        currentUser={user}
                        selectedUser={selectedConversation}
                        onNewMessage={newMessage}
                        sendMessage={sendMessage}
                    />
                </div>
            </div>

            <NewChatModal
                open={isNewChatModalOpen}
                onOpenChange={setNewChatModalOpen}
                onSelectUser={handleStartNewChat}
            />
        </>
    );
};

export default ChatPage;