import { Navigate } from 'react-router-dom';
import { message } from 'antd';
import { useEffect } from 'react';

interface UserGuardProps {
    children: React.ReactNode;
}

const UserGuard = ({ children }: UserGuardProps) => {
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            message.warning('Please login to see this page');
        }
    }, [token]);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default UserGuard;
