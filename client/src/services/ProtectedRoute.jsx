import React, { useEffect, useState } from 'react';
import { useAuth } from './authContext';
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ element, requiredRoles }) => {
    const { isAuthenticated, userRoles } = useAuth();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated !== null) {
            setLoading(false);
        }
    }, [isAuthenticated]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-yellow-400 border-dashed rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">로딩중입니다. 잠시만 기다려주세요...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated && requiredRoles !== null) {
        return (
            <div className="text-center">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">로그인이 필요합니다</h2>
                    <p className="text-gray-600 mb-6">
                        페이지에 접근하려면 로그인해주세요<br /> 로그인 후 다시 시도해 주세요.
                    </p>
                    <button
                        type="button"
                        className="text-white w-52 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-3 w-full transition"
                        onClick={() => navigate('/signIn')}
                    >
                        로그인 하러가기
                    </button>
                </div>
            </div>
        );
    }

    if (requiredRoles && !requiredRoles.some(role => userRoles.includes(role))) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-lg font-medium text-red-600">권한이 없습니다.</p>
            </div>
        );
    }

    return element;
};

export default ProtectedRoute;
