import { groupApi, handleApiError } from "../../api/api";
import { SET_CHATS, SET_CURRENT_CHAT } from "./chatActions";


export const FETCH_GROUP_PROFILE = 'FETCH_GROUP_PROFILE';
export const UPDATE_GROUP_PROFILE = 'UPDATE_GROUP_PROFILE';

export const fetchGroupProfile = (groupId) => async (dispatch) => {
    try {
        const response = await groupApi.getGroupProfile(groupId);
        console.log('>>> fetchGroupProfile', response.data);
        dispatch({ type: FETCH_GROUP_PROFILE, payload: response.data });
    }catch (err){
        console.log(err);
    }   
}

export const updateGroupProfile = (groupId, data) => async (dispatch, getState) => {
    try {
        await groupApi.updateGroupProfile(groupId, data)
        const response = await groupApi.getGroupProfile(groupId)
        const updatedGroup = response.data

        dispatch({type: UPDATE_GROUP_PROFILE, payload: updatedGroup})

        const {chats, currentChat} = getState().chat
        const updatedChats = chats.map(chat => (
            chat.id === groupId ? {...chat, ...updatedGroup, isGroup: true} : chat
        ))
        dispatch({type: SET_CHATS, payload: updatedChats})

        if (currentChat && currentChat.id === groupId){
            dispatch({type: SET_CURRENT_CHAT, payload: {...currentChat, ...updatedGroup, isGroup: true}})
        }
    }catch (err){
        const errorMessage = handleApiError(err);
        console.error('Error updating group profile:', errorMessage);
        // throw err;
    }
}

export const addUserToGroup = (groupId, userId) => async (dispatch) => {
    try {
        const response = await groupApi.addUserToGroup(groupId, userId)
        dispatch({type: UPDATE_GROUP_PROFILE, payload: response.data})
    } catch(err) {
        console.error('Error adding user to group:', err);
    }
}

export const removeUserFromGroup = (groupId, userId) => async (dispatch) => {
    try {
        const response = await groupApi.removeUserFromGroup(groupId, userId);
        dispatch({ type: UPDATE_GROUP_PROFILE, payload: response.data });
    } catch (error) {
        console.error('Error removing user from group:', error);
    }
};