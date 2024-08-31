import { SET_CHATS, ADD_CHAT, SET_CURRENT_CHAT, UPDATE_CHAT_LATEST_MESSAGE, UPDATE_CHAT } from '../actions/chatActions';

const initialState = {
    chats: [],
    currentChat: null,
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CHATS:
            return {
                ...state,
                chats: action.payload,
            };
        case ADD_CHAT:
            return {
                ...state,
                chats: [...state.chats, action.payload],
            };
        case SET_CURRENT_CHAT:
            return {
                ...state,
                currentChat: action.payload,
            };
        case UPDATE_CHAT_LATEST_MESSAGE:
            return {
                ...state,
                chats: state.chats.map((chat) =>
                    chat.id === action.payload.chatId ? { ...chat, latesMessage: action.payload.message } : chat,
                ),
                currentChat:
                    state.currentChat && state.currentChat.id === action.payload.chatId
                        ? { ...state.currentChat, latestMessage: action.payload.message }
                        : state.currentChat,
            };

        default:
            return state;
    }
};
export default chatReducer;
