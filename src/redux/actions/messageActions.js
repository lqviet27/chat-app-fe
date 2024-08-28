import {messageApi} from "../../api/api"

export const ADD_MESSAGE = 'ADD_MESSAGE';
export const SET_MESSAGES = 'SET_MESSAGES';

export const fetchMessages = (chatId) => async (dispatch) => {
    try {
        const response = await messageApi.getMessages(chatId);
        console.log(response);
        dispatch({ type: SET_MESSAGES, payload: response.data });
    }catch (err){

    }
}

