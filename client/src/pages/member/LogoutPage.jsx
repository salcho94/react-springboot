import React, { useEffect } from 'react';
import { useAuth } from '@/services/authContext';

const Logout = () => {
    const { logout } = useAuth();

    useEffect(() => {
        // 로그아웃 처리
        logout('token');
    }, []);

    return (
        <div>
            <p>로그아웃 중...</p>
        </div>
    );
};

export default Logout;
