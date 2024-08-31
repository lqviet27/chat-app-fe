import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';
import { fetchChats, setCurrentChat } from '../../redux/actions/chatActions';
import { setSearchResults } from '../../redux/actions/searchActions';
import SearchSidebar from './SearchSidebar';
import UserProfile from './UserProfile';
import GroupProfile from './GroupProfile';
import { useWebSocket } from '../../customHooks/useWebSocket';

const MainChat = () => {
    const dispatch = useDispatch();
    const currentChat = useSelector((state) => state.chat.currentChat);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [viewingProfile, setViewingProfile] = useState(null);

    useWebSocket()
    
    useEffect(() => {
        const fetchData = async () => {
            const fetchedChats = await dispatch(fetchChats());
            console.log(fetchedChats);
            const storedChatId = localStorage.getItem('currentChatId');
            if (storedChatId && fetchedChats.length > 0) {
                dispatch(setCurrentChat(parseInt(storedChatId)));
            }
        };
        fetchData();
    }, []);

    const handleSearchClick = () => {
        setIsSearchOpen(true);
        dispatch(setSearchResults([]));
    };
    const handleProfileClick = (id) => {
        console.log(">>> check id profile", id)
        setViewingProfile({ type: 'user', id });
    };
    const handleGroupProfileClick = (id) => {
        console.log(">>> check id profile", id)
        setViewingProfile({ type: 'group', id });
    };
    const closeProfile = () => {
        setViewingProfile(null);
    };

    return (
        <div className="flex h-screen bg-gray-900">
            <Sidebar />
            <div className="border-l border-gray-700 flex flex-1 relative">
                <div
                    className={`flex flex-col flex-1 ${
                        isSearchOpen || viewingProfile ? 'border-r border-gray-700' : ''
                    }`}
                >
                    {currentChat ? (
                        <>
                            <ChatHeader
                                onSearchClick={handleSearchClick}
                                onProfileClick={handleProfileClick}
                                onGroupProfileClick={handleGroupProfileClick}
                            />
                            <ChatMessages />
                            <MessageInput />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-white">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-2">Welcome to BK Chat</h2>
                                <p>Select a chat or start a new conversation</p>
                            </div>
                        </div>
                    )}
                </div>
                {isSearchOpen && (
                    <div className="w-96 h-full border-l border-gray-700">
                        <SearchSidebar onClose={() => setIsSearchOpen(false)} />
                    </div>
                )}
                {viewingProfile && (
                    <div className="w-96 h-full border-l border-gray-700">
                        {viewingProfile.type === 'user' ? (
                            <UserProfile
                                userId = {viewingProfile.id}
                                onClose = {closeProfile} 
                            />
                        ) : (
                            <GroupProfile
                                groupId={viewingProfile.id}
                                onClose={closeProfile} 
                                onUserProfileClick={handleProfileClick}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainChat;
