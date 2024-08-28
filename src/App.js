import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signin from './components/Signin';
import Signup from './components/Signup';
import PrivateRoute from './routes/PrivateRoute';
import MainChat from './components/Chat/MainChat';
import { fetchUser } from './redux/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

function App() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    console.log('co goi tui !!!!!!!!!!');
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchUser());
        }
    }, [isAuthenticated, dispatch]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <MainChat />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/signin" />} />
            </Routes>

            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </BrowserRouter>
    );
}
export default App;
