import React from 'react';
import { useAuth } from '@/services/authContext';
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { themeState } from "@/recoil/theme/atoms";
import { userDataState } from "@/recoil/auth/atoms";

const LoginComponent = () => {
    const { logout, isAuthenticated } = useAuth();
    const [theme] = useRecoilState(themeState);
    const [user] = useRecoilState(userDataState) ?? {};
    const navigate = useNavigate();

    const handleLogOut = () => {
        logout();
    };

    return (
        <div className="flex items-center">
            {!isAuthenticated ? (
                <div className="flex justify-center w-full">
                    <button
                        className={`px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base ${
                            theme === "dark"
                                ? "bg-black text-white border border-gray-600 hover:bg-gray-800 hover:border-gray-400"
                                : "bg-white text-black border border-gray-300 hover:bg-gray-100 hover:border-gray-500"
                        } font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out`}
                        onClick={() => navigate('/signIn')}
                    >
                        로그인
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* 닉네임 표시 (모바일에서는 숨김) */}
                    <div className={`
                        hidden sm:flex items-center px-4 py-2 rounded-full font-medium gap-2 shadow-sm transition-all duration-200 ease-in-out
                        ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"}
                        hover:scale-105
                    `}>
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        <strong>{user?.nickName || "게스트"}</strong> 님
                    </div>

                    {/* 로그아웃 버튼 */}
                    <button
                        className={`px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base ${
                            theme === "dark"
                                ? "bg-black text-white border border-gray-600 hover:bg-gray-800 hover:border-gray-400"
                                : "bg-white text-black border border-gray-300 hover:bg-gray-100 hover:border-gray-500"
                        } font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out`}
                        onClick={handleLogOut}
                    >
                        로그아웃
                    </button>
                </div>
            )}
        </div>
    );
};

export default LoginComponent;
