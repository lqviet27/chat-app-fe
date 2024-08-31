import { messageApi } from '../../api/api';
import { updateChatLatestMessage } from './chatActions';

export const ADD_MESSAGE = 'ADD_MESSAGE';
export const SET_MESSAGES = 'SET_MESSAGES';

export const fetchMessages = (chatId) => async (dispatch) => {
    try {
        const response = await messageApi.getMessages(chatId);
        console.log(response);
        dispatch({ type: SET_MESSAGES, payload: response.data });
    } catch (err) {}
};

export const sendMessage = (message) => async (dispatch) => {};

export const addMessage = (message) => async (dispatch) => {
    dispatch({ type: ADD_MESSAGE, payload: message });
    dispatch(updateChatLatestMessage(message.chatId, message));
};
