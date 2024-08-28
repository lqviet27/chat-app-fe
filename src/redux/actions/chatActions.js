import { chatApi } from '../../api/api';

export const SET_CHATS = 'SET_CHATS';
export const ADD_CHAT = 'ADD_CHAT';
export const SET_CURRENT_CHAT = 'SET_CURRENT_CHAT';
export const UPDATE_CHAT_LATEST_MESSAGE = 'UPDATE_CHAT_LATEST_MESSAGE';
export const UPDATE_CHAT = 'UPDATE_CHAT';

export const fetchChats = () => async (dispatch, getState) => {
    try {
        const response = await chatApi.getUserChats();
        console.log(response);
        
        if (!Array.isArray(response.data)) {
            throw new Error('Invalid response from server');
        }

        const currentUser = getState().auth.user;

        if (!currentUser) {
            console.error('Current user is not defined');
            return;
        }

        const chatsWithLatestMessages = response.data.map((chat) => ({
            ...chat,
            isGroup: chat.group,
            chatName: chat.group
                ? chat.chatName || 'Unnamed Group'
                : chat.users.find((user) => user.id !== currentUser.id)?.name || 'User',
            latestMessage:
                chat.messages && chat.messages.length > 0
                    ? {
                          ...chat.messages[chat.messages.length - 1],
                          timestamp: new Date(chat.messages[chat.messages.length - 1].timestamp),
                      }
                    : null,
        }));
        dispatch({ type: SET_CHATS, payload: chatsWithLatestMessages });
        console.log(">>check lates mess" , chatsWithLatestMessages);
        return chatsWithLatestMessages;
    } catch (err) {
        console.log(err);
    }
};


export const setCurrentChat = (chatId) => async (dispatch, getState) => {
    try{
        const {chats } = getState().chat;
        let currentChat = chats.find((chat) => chat.id === chatId);

        if(!currentChat){
            const response = await chatApi.getChatById(chatId);
            currentChat = response.data;
        }
        dispatch({ type: SET_CURRENT_CHAT, payload: currentChat });
    }catch(err) {
        console.log(err);
    }
}