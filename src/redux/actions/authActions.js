import { authAp, userApi } from '../../api/api';

export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAIL = 'SIGN_UP_FAIL';
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
export const SIGN_IN_FAIL = 'SIGN_IN_FAIL';
export const LOGOUT = 'LOGOUT';
export const SET_USER = 'SET_USER';
export const FETCH_USER_PROFILE = 'FETCH_USER_PROFILE';
export const FETCH_COMMON_GROUPS = 'FETCH_COMMON_GROUPS';

export const loginSuccess = (token) => {
    return {
        type: SIGN_IN_SUCCESS,
        payload: token,
    };
};

export const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});

export const fetchUser = () => async (dispatch) => {
    try {
        const response = await userApi.getProfile();
        console.log(response);
        dispatch(setUser(response.data));
    } catch (err) {
        console.log('Error fetching user' + err);
    }
};

export const signupSuccess = () => {
    return {
        type: SIGN_UP_SUCCESS,
    };
};

export const logout = () => (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: LOGOUT });
};