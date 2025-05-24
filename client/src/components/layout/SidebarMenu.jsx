import React, { useEffect } from "react";
import "@/assets/css/sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { themeState } from "@/recoil/theme/atoms";
import Logo from "@/assets/logo.png";
import { userRolesState, menuState } from "@/recoil/auth/atoms";
import useFetch from "@/hooks/useFetch";
import axiosInstance from "@/services/axiosInstance";

const SidebarMenu = ({ isOpen, onClose }) => {
    const theme = useRecoilValue(themeState);
    const navigate = useNavigate();
    const [userRoles] = useRecoilState(userRolesState);
    const [menuData, setMenuData] = useRecoilState(menuState); // 메뉴 상태 관리


    useEffect(() => {
         axiosInstance.get('/api/menu/getMenuList', {
            params: {
                auth: userRoles[0]
            },
        }).then(res => {
            setMenuData(res.data)
         });
        if (!menuData.length) {
        }
    }, []);

    if (!isOpen) return null;

    return (
        <div className={`sidebar-container ${isOpen ? "open" : "closed"} max-h-screen overflow-y-auto`}>
            <div className="sidebar-header">
                <img
                    src={Logo}
                    alt="Logo"
                    className="logo"
                    onClick={() => {
                        navigate("/");
                        onClose();
                    }}
                />
                <button className="close-btn" onClick={onClose}>
                    ✕
                </button>
            </div>
            <ul className="menu-list space-y-4">
                {Array.isArray(menuData) && menuData.length > 0 ? (
                    menuData.map((menu) => (
                        <li key={menu.id}>
                            <NavLink
                                to={menu.path}
                                className={({ isActive }) =>
                                    `block font-medium p-2 rounded transition-all ${
                                        isActive
                                            ? theme === "dark"
                                                ? "text-white bg-gray-700"
                                                : "text-dark-600 bg-white-100"
                                            : theme === "dark"
                                                ? "text-gray-900 hover:bg-gray-600"
                                                : "text-gray-700 hover:bg-gray-100"
                                    }`
                                }
                                onClick={onClose}
                            >
                                {menu.name}
                            </NavLink>
                        </li>
                    ))
                ) : (
                    <li>메뉴가 없습니다.</li>
                )}
            </ul>
        </div>
    );
};

export default SidebarMenu;
