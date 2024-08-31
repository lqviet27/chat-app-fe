import { useDispatch, useSelector } from 'react-redux';
import WebSocketService from '../service/WebSocketService';
import { useEffect } from 'react';
import { ADD_MESSAGE } from '../redux/actions/messageActions';

export const useWebSocket = () => {
    const dispatch = useDispatch();
    const currentChat = useSelector((state) => state.chat.currentChat);

    useEffect(() => {
        WebSocketService.connect(() => {
            console.log('Connected to WebSocket');
        });

        return () => {
            WebSocketService.disconnect();
        };
    }, []);

    useEffect(() => {
        if (currentChat) {
            console.log(`Subscribing to /group/${currentChat.id}`);
            WebSocketService.subscribe(`/group/${currentChat.id}`, (message) => {
                console.log('Received message from WebSocket', message);
                dispatch({ type: ADD_MESSAGE, payload: message });
            });

            return () => {
                console.log(`Usubscribing from /group/${currentChat.id}`);
                WebSocketService.unsubscribe(`/group/${currentChat.id}`);
            };
        }
    }, [currentChat, dispatch]);
};
