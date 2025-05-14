import { Outlet, Navigate } from 'react-router-dom'

const ProtectedRoute = () => {
    const accessToken = localStorage.getItem('access_token');

    return(
        accessToken ? <Outlet /> : <Navigate to="/login" />
    );
}

export default ProtectedRoute
