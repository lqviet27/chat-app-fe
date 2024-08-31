import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import authReducer from './reducers/authReducer';
import chatReducer from './reducers/chatReducer';
import messageReducer from './reducers/messageReducer';
import searchReducer from './reducers/searchReducer';
import groupReducer from './reducers/groupReducer';
import userReducer from './reducers/userReducer';
const rootReducer = combineReducers({
    auth: authReducer,
    chat: chatReducer,
    message: messageReducer,
    search: searchReducer,
    user: userReducer,
    group: groupReducer,
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
