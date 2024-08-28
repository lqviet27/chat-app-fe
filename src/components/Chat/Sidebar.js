import React, { useState, useEffect, Profiler } from 'react';
import { ResizableBox } from 'react-resizable';
import { HiChat } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { BiBot, BiPlus, BiDotsVerticalRounded, BiSearch, BiArrowBack } from 'react-icons/bi';
import { FiUser, FiUsers } from 'react-icons/fi';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { fetchChats, setCurrentChat } from '../../redux/actions/chatActions';
import Profile from './Profile';
import AddGroupMembers from './AddGroupMembers';
import GroupDetails from './GroupDetails';

const Sidebar = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentView, setCurrentView] = useState('chats');

    const dispatch = useDispatch();
    const chats = useSelector((state) => state.chat.chats);
    const currentUser = useSelector((state) => state.auth.user);
    const currentChat = useSelector((state) => state.chat.currentChat);

    useEffect(() => {
        console.log('co vo day 222222222');
        if (currentChat) {
            console.log('co vo day 3333333');
            localStorage.setItem('currentChatId', currentChat.id);
        }
    }, [currentChat]);
    const handleLogout_test = () => {
        console.log('click me');
    };
    const handleLogout = () => {
        console.log('click me');
    };

    const handleSearchChange = () => {};
    const handleChatClick = (chatId) => {
        console.log('>>>>> chatId', chatId);
        dispatch(setCurrentChat(chatId));
    };
    return (
        <ResizableBox
            width={400}
            height={Infinity}
            minConstraints={[300, Infinity]}
            maxConstraints={[600, Infinity]}
            axis="x"
            resizeHandles={['e']}
            className="bg-gray-900 text-white flex flex-col border border-red-500"
        >
            <div className="flex flex-col h-full">
                {/* header sidebar */}
                <div className="flex items-center justify-between p-4 h-16 border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                        <HiChat className="text-3xl" />
                        <h2 className="text-xl font-bold">BK Chat</h2>
                    </div>
                    <div className="flex space-x-3">
                        <BiBot className="text-2xl cursor-pointer" />
                        <BiPlus className="text-2xl cursor-pointer" />
                        <Menu as="div" className="relative inline-block text-left">
                            <div>
                                <MenuButton className="inline-flex justify-center w-full text-sm font-medium text-white">
                                    <BiDotsVerticalRounded className="text-2xl cursor-pointer" />
                                </MenuButton>
                            </div>
                            <MenuItems className="absolute right-0 w-56 mt-2 origin-top-right bg-gray-800 border border-gray-700 divide-y divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                <div className="px-1 py-1">
                                    <MenuItem>
                                        {({ active }) => (
                                            <button
                                                onClick={() => handleLogout_test(true)}
                                                className={`${
                                                    active ? 'bg-gray-700 text-white' : 'text-gray-300'
                                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                            >
                                                Profile
                                            </button>
                                        )}
                                    </MenuItem>

                                    <MenuItem>
                                        {({ active }) => (
                                            <button
                                                onClick={handleLogout}
                                                className={`${
                                                    active ? 'bg-gray-700 text-white' : 'text-gray-300'
                                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                            >
                                                Log out
                                            </button>
                                        )}
                                    </MenuItem>
                                </div>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
                {showProfile ? (
                    <Profile />
                ) : currentView === 'newChat' ? (
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-gray-700 flex items-center">
                            <BiArrowBack
                                className="text-2xl cursor-pointer mr-4"
                                onClick={() => setCurrentView('chats')}
                            />
                            <h2 className="text-xl font-bold text-white">New Chat</h2>
                        </div>
                        <div className="p-4">
                            <div className="relative">
                                <BiSearch className="absolute top-3 left-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for users or groups"
                                    className="w-full bg-gray-800 rounded-full p-2 pl-10 text-white focus:outline-none"
                                    // value={searchQuery}
                                    // onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                        <div className="p-4">
                            <button
                                className="w-full bg-green-600 text-white rounded-full p-2 flex items-center justify-center"
                                onClick={() => setCurrentView('addGroupMembers')}
                            >
                                <FiUsers className="text-2xl mr-2" />
                                New Group
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">search</div>
                    </div>
                ) : currentView === 'addGroupMembers' ? (
                    <AddGroupMembers />
                ) : currentView === 'groupDetails' ? (
                    <GroupDetails />
                ) : (
                    <>
                        <div className="p-4 border-b border-gray-700">
                            <div className="relative">
                                <BiSearch className="absolute top-3 left-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search or start new chat"
                                    className="w-full bg-gray-800 rounded-full p-2 pl-10 text-white focus:outline-none"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {searchResults.length > 0 ? (
                                <div>xu ly hien thi phan search result</div>
                            ) : chats.length > 0 ? (
                                chats.map((chat) => {
                                    console.log('Rendering chat:', chat);
                                    const chatName = chat.isGroup
                                        ? chat.chatName
                                        : chat.users.find((user) => user.id !== currentUser.id)?.name || 'User';
                                    const profileImage = chat.isGroup
                                        ? chat.chatImage
                                        : chat.users.find((user) => user.id !== currentUser.id)?.profile?.image;
                                    return (
                                        <div
                                            key={chat.id}
                                            className={`p-4 flex items-center justify-between cursor-pointer bg-gray-800${
                                                currentChat && currentChat.id === chat.id
                                                    ? 'bg-gray-800'
                                                    : 'hover:bg-gray-800'
                                            }`}
                                            onClick={() => handleChatClick(chat.id)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center">
                                                    {chat.isGroup ? (
                                                        profileImage ? (
                                                            <img
                                                                src={profileImage}
                                                                alt="Group"
                                                                className="w-full h-full rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <FiUsers className="text-2xl text-gray-400" />
                                                        )
                                                    ) : profileImage ? (
                                                        <img
                                                            src={profileImage}
                                                            alt="Profile"
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <FiUser className="text-2xl text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold">{chatName}</h3>
                                                    <p className="text-sm text-gray-400">
                                                        {chat.latestMessage
                                                            ? `${chat.latestMessage.content.substring(0, 30)}${
                                                                  chat.latestMessage.content.length > 30 ? '...' : ''
                                                              } - ${new Date(
                                                                  chat.latestMessage.timestamp,
                                                              ).toLocaleTimeString()}`
                                                            : 'No messages'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-4 text-center text-gray-500">No chats available</div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </ResizableBox>
    );
};

export default Sidebar;
