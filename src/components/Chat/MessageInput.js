import { useSelector, useDispatch } from 'react-redux';
import { FiPaperclip, FiSmile, FiSend } from 'react-icons/fi';
import { useState } from 'react';

const MessageInput = () => {
    const [message, setmessage] = useState("")
    const currentChat = useSelector(state => state.chat.currentChat)
    const currentUser = useSelector(state => state.auth.user)
    

    

    return (
        <div className="relative">
            <form className="flex items-center p-4 bg-gray-900 border-t border-gray-700">
                <input
                    type="text"
                    placeholder="Type a message"
                    className="flex-1 p-2 rounded-lg bg-gray-800 text-white focus:outline-none"
                />
                <div className="flex space-x-4 items-center ml-4">
                    <FiPaperclip />
                    <FiSmile />
                    <button className="focus:outline-none">
                        <FiSend className="text-2xl cursor-pointer text-gray-400" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MessageInput;
