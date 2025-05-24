import React, { useState } from "react";
import SidebarMenu from "@/components/layout/SidebarMenu";
import { useRecoilState } from "recoil";
import { themeState } from "@/recoil/theme/atoms";
import { Sun, Moon, Menu, X } from "lucide-react";
import Footer from "@/components/layout/Footer";
import LoginComponent from "@/components/layout/LoginComponent";
import {useAuth} from "@/services/authContext";
const Dashboard = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [theme, setTheme] = useRecoilState(themeState);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 사이드바 열기/닫기 상태
    // 테마 전환 함수
    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    // 사이드바 토글 함수
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div
            className={`min-h-screen flex flex-col transition-all ${
                theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
            }`}
        >
            {/* 헤더 */}
            <header
                className={`${
                    theme === "dark" ? "bg-gray-800 text-white" : "bg-white-600 text-black"
                } p-4 shadow-md`}
            >
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex">
                        {isAuthenticated && <button
                            onClick={toggleSidebar}
                            className={`p-2 rounded-md ${
                                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-blue-500"
                            }`}
                            aria-label="Toggle Sidebar"
                        >
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>}
                        <h1 className="text-xl font-bold p-1">SALCHO</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <LoginComponent />
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-md flex items-center gap-2"
                            aria-label="Toggle Theme"
                        >
                            {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
                        </button>

                    </div>
                </div>
            </header>

            {/* 본문 */}
            <div className="flex flex-1 relative">
                {/* 사이드바 */}
                {isSidebarOpen && (
                    <aside
                        className={`fixed top-0 left-0  h-full z-50 transition-transform ${
                            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
                        } shadow-lg transform ${
                            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                    >
                        <div className="p-4">
                            <button
                                onClick={toggleSidebar}
                                className={`mb-4 p-2 rounded-md ${
                                    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                                }`}
                            >
                                <X size={24} />
                            </button>
                            <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                        </div>
                    </aside>
                )}

                {/* 오버레이 */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={toggleSidebar}
                        aria-hidden="true"
                    ></div>
                )}

                {/* 메인 컨텐츠 */}
                <main className="flex-1 p-none sm:p-6">
                    <div
                        className={`${
                            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
                        } rounded-lg shadow-lg p-6 max-w-6xl mx-auto `}
                    >
                        {children}
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;
