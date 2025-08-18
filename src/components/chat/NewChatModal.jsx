import React, { useState, useEffect } from 'react';
import { useDebounce } from "@/hooks/useDebounce"; // Assuming you have this hook from previous work
import apiClient from '@/api/axiosConfig';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";

export const NewChatModal = ({ open, onOpenChange, onSelectUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        if (!debouncedSearchTerm) {
            setResults([]);
            return;
        }

        const search = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get(`/chat/search?q=${debouncedSearchTerm}`);
                setResults(response.data);
            } catch (error) {
                console.error("Failed to search for users", error);
            } finally {
                setIsLoading(false);
            }
        };

        search();
    }, [debouncedSearchTerm]);

    const handleSelect = (user) => {
        onSelectUser(user); 
        setSearchTerm('');
        setResults([]);
        onOpenChange(false); 
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Message</DialogTitle>
                    <DialogDescription>Search for an employee to start a conversation.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Input
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                        {isLoading && <div className="flex justify-center"><Spinner /></div>}
                        {!isLoading && results.map(user => (
                            <div
                                key={user.id}
                                className="flex items-center p-2 rounded-md cursor-pointer hover:bg-muted"
                                onClick={() => handleSelect(user)}
                            >
                                <Avatar className="h-10 w-10 mr-3">
                                    <AvatarImage src={user.picture} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p className="font-semibold">{user.name}</p>
                            </div>
                        ))}
                         {!isLoading && debouncedSearchTerm && results.length === 0 && (
                            <p className="text-center text-muted-foreground">No users found.</p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};