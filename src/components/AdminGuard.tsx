import { Navigate } from 'react-router-dom';
import { message } from 'antd';
import { useEffect } from 'react';

interface AdminGuardProps {
    children: React.ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            message.warning('Please login to access admin dashboard');
        }
    }, [token]);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default AdminGuard;
