import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from '../../redux/actions/messageActions';

const ChatMessages = () => {
    const dispatch = useDispatch();
    const currentChat = useSelector((state) => state.chat.currentChat);
    const messages = useSelector((state) => state.message.messages);
    const currentUser = useSelector((state) => state.auth.user);
    const messageEndRef = useRef(null)

    useEffect(() => {
        if (currentChat) {
            dispatch(fetchMessages(currentChat.id));
        }
    }, [currentChat]);

    useEffect(() => {
        messageEndRef.current.scrollIntoView({behavior: "smooth"})
    },[messages])

    const isCurrentUserMessage = (message) => {
        return message.user?.id === currentUser?.id;
    };

    return (
        <div className="flex-1 p-4 overflow-y-auto bg-gray-900">
            <div className="flex flex-col space-y-2">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        id={`message-${message.id}`}
                        className={`${
                            isCurrentUserMessage(message) ? 'self-end bg-green-600' : 'self-start bg-gray-800'
                        } text-white p-3 rounded-lg max-w-xs`}
                    >
                        <p>{message.content}</p>
                        <span className="text-xs text-gray-400 block mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
                <div ref={messageEndRef}></div>
            </div>
        </div>
    );
};

export default ChatMessages;
