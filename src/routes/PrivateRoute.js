import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = (props) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    // console.log(useSelector((state) => state.auth.token));
    // console.log(isAuthenticated);
    if (!isAuthenticated) {
        return <Navigate to="/signin" />;
    }

    return <div>{props.children}</div>;
};

export default PrivateRoute;
