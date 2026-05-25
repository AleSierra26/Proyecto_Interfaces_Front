import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        return <Navigate to="/home" replace />;
    }

    return children;
}