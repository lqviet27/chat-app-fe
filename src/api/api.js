import axios from 'axios';

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

export default api;
