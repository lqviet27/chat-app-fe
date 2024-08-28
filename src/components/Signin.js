import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { HiChat } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { authApi } from '../api/api';
import { loginSuccess } from '../redux/actions/authActions';

const Signin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleFocus = () => {
        setErrorMessage('');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authApi.signIn(formData);
            console.log(response);
            const { jwt } = response.data;
            if (jwt) {
                dispatch(loginSuccess(jwt));
                toast.success('Sign in successful');
                localStorage.setItem('token', jwt);
                navigate('/');
            } else {
                throw new Error('Token not found in response');
            }
        } catch (err) {
            console.log(err.response);
            setErrorMessage(err.response?.data?.em || 'Invalid username or password');
            toast.error(err.response?.data?.em);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="flex h-full flex-wrap items-center justify-center lg:justify-between">
                <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
                    <img
                        src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                        className="w-full"
                        alt="Sample image"
                    />
                </div>

                <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                        <div className="flex items-center justify-center mb-6">
                            <HiChat className="text-3xl text-white mr-2" />
                            <h1 className="text-3xl font-bold text-white">BK Chat</h1>
                        </div>
                        <h2 className="text-2xl font-bold text-center text-white mb-6">Sign In</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    className="w-full p-2 bg-gray-700 rounded-lg text-white focus:outline-none"
                                    placeholder="Enter your email"
                                    required
                                    onChange={(e) => handleChange(e)}
                                    onFocus={handleFocus}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    className="w-full p-2 bg-gray-700 rounded-lg text-white focus:outline-none"
                                    placeholder="Enter your password"
                                    required
                                    onChange={(e) => handleChange(e)}
                                    onFocus={handleFocus}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 p-2 rounded-lg text-white hover:bg-blue-600"
                            >
                                Sign In
                            </button>
                            {<p className="text-red-500 text-sm mt-2"></p>}
                        </form>
                        <p className="text-gray-400 text-sm mt-4 text-center">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-blue-500 hover:text-blue-300">
                                Sign up
                            </Link>
                        </p>
                        <p className="text-gray-400 text-sm mt-2 text-center">
                            <Link to="/forgot-password" className="text-blue-500 hover:text-blue-300">
                                Forgot Password?
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;
