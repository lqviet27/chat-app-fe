import axios from 'axios';
import { toast } from 'react-toastify';
export const API_URL = process.env.REACT_APP_API_URL;

const getToken = () => {
    return localStorage.getItem('token');
};

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    signUp: (data) => api.post('/auth/signup', data),
    signIn: (data) => api.post('/auth/signin', data),
};

export const userApi = {
    getProfile: () => api.get('/api/users/profile'),
    updateUser: (data) => api.put('/api/users/update', data),
    searchUsers: async (query) => {
        try {
            const response = await api.get(`/api/users/${query}`);
            return response.data.map((res) => ({
                ...res,
                isGroup: res.hasOwnProperty('chatName'),
            }))
        } catch (err) {
            console.error('Error searching users and groups:', err);
            throw err;
        }
    },
    getUserProfile: (userId) => api.get(`/api/users/profile/${userId}`),
    getCommonGroups: (userId) => api.get(`/api/users/commom-groups/${userId}`)
};

export const groupApi = {
    getGroupProfile: (groupId) => api.get(`/api/chats/group/${groupId}`),
    updateGroupProfile: (groupId, data) => api.put(`/api/chats/update-group/${groupId}`, data),
    addUserToGroup: (groupId, userId) => api.put(`/api/chats/${groupId}/add/${userId}`),
    removeUserFromGroup: (groupId, userId) => api.put(`/api/chats/${groupId}/remove/${userId}`),
}

export const chatApi = {
    getUserChats: () => api.get('api/chats/user'),
    createChat: (userId) => api.post('api/chats/single', { userId }),
    createGroupChat: (data) => api.post('api/chats/group', data),
    getChatById: (chatId) => api.get(`api/chats/${chatId}`),
};

export const messageApi = {
    getMessages: (chatId) => api.get(`api/messages/${chatId}`),
};

export const handleApiError = (error) => {
    if (error.response) {
        toast.error(error.response.data.em);
        console.error("API Error:", error.response.data);
        return error.response.data;
    } else if (error.request) {
        console.error("No response received:", error.request);
        return { message: "No response received from server" };
    } else {
        console.error("Error:", error.message);
        return { message: "An error occurred while processing your request" };
    }
};


export default api;
