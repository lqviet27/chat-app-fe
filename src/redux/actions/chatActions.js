import { chatApi, handleApiError } from '../../api/api';

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

        const chats = response.data.map((chat) => ({
            ...chat,
            isGroup: chat.group,
            chatName: chat.group
                ? chat.chatName || 'Unnamed Group'
                : chat.users.find((user) => user.id !== currentUser.id)?.name || 'User',
        }));
        dispatch({ type: SET_CHATS, payload: chats });
        console.log('>>check lates mess', chats);
        return chats;
    } catch (err) {
        const errorMessage = handleApiError(err);
        console.error('Error fetching chats:', errorMessage);
        throw err;
    }
};

export const setCurrentChat = (chatId) => async (dispatch, getState) => {
    try {
        const { chats } = getState().chat;
        let currentChat = chats.find((chat) => chat.id === chatId);

        if (!currentChat) {
            const response = await chatApi.getChatById(chatId);
            currentChat = response.data;
        }
        dispatch({ type: SET_CURRENT_CHAT, payload: currentChat });
    } catch (err) {
        const errorMessage = handleApiError(err);
        console.error('Error setting current chat:', errorMessage);
    }
};

export const createChat = (userId) => async (dispatch) => {
    try {
        const response = await chatApi.createChat(userId);
        console.log('>>> create chat', response);
        const newChat = { ...response.data, latestMessage: null, isGroup: false };
        dispatch({ type: ADD_CHAT, payload: newChat });
        dispatch({ type: SET_CURRENT_CHAT, payload: newChat });
        return newChat;
    } catch (err) {
        const errorMessage = handleApiError(err);
        console.error('Error creating chat:', errorMessage);
        throw err;
    }
};

export const createGroupChat = (groupData) => async (dispatch, getState) => {
    try {
        const currentUser = getState().auth.user;
        if (!currentUser) {
            throw new Error('Current user not found');
        }
        const userIds = new Set([...groupData.userIds, currentUser.id]);
        const payload = {
            ...groupData,
            userIds: Array.from(userIds),
        };
        const response = await chatApi.createGroupChat(payload);
        const newGroupChat = {
            ...response.data,
            latestMessage: null,
            isGroup: true,
            chatName: groupData.chatName || response.data.chatName || 'Unnamed Group',
            chatImage: groupData.chatImage || response.data.chatImage,
            users: [currentUser, ...response.data.users.filter((user) => user.id !== currentUser.id)],
        };
        dispatch({ type: ADD_CHAT, payload: newGroupChat });
        dispatch({ type: SET_CURRENT_CHAT, payload: newGroupChat });
        return newGroupChat;
    } catch (err) {
        const errorMessage = handleApiError(err);
        console.error('Error creating group chat:', errorMessage);
        throw err;
    }
};

export const updateChatLatestMessage = (chatId, message) => ({
    type: UPDATE_CHAT_LATEST_MESSAGE,
    payload: { chatId, message }
})
export const updateChat = (chatId, updateChat) => {

}
