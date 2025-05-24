import React, { useState } from 'react';
import {useAlert, useConfirm} from "@/hooks/useModal";
import axiosInstance from "@/services/axiosInstance";

const MenuInsert = ({fetchMenuData = () => {} }) => {
    // 상태 정의
    const [newMenu, setNewMenu] = useState({
        name: '',
        path: '',
        auth: ''
    });
    const{ showAlert,AlertDialog } =useAlert()
    const { showConfirm, ConfirmDialog } = useConfirm();

    // 상태 업데이트 함수
    const handleNewMenuChange = (e) => {
        const { name, value } = e.target;
        setNewMenu((prevMenu) => ({
            ...prevMenu,
            [name]: value,
        }));
    };

    // 메뉴 추가 함수
    const handleAddMenu  = async () => {
        if (!newMenu.name || !newMenu.path || !newMenu.auth) {
            await showAlert('미입력 항목 존재',"모든 항목을 입력해주세요.");
            return;
        }
        if (await showConfirm('메뉴 등록', '새로운 메뉴를 등록하시겠습니까?')) {
            axiosInstance.post('/api/menu/menuInsert', {
                name: newMenu.name,
                auth: newMenu.auth,
                path: newMenu.path
            })
                .then(res => {
                    fetchMenuData();
                    showAlert('등록 성공', res.data);
                })
                .catch(error => {
                    showAlert('등록 실패', error.response ? error.response.data : error.message);
                });
        }
    };

    return (
        <div className="p-6 bg-gray-50/50 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-700 mb-4">새 메뉴 추가</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                    type="text"
                    name="name"
                    placeholder="메뉴 이름"
                    value={newMenu.name}
                    onChange={handleNewMenuChange}
                    className="block w-full rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 px-4 py-2.5 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors duration-200"
                />
                <input
                    type="text"
                    name="path"
                    placeholder="메뉴 경로"
                    value={newMenu.path}
                    onChange={handleNewMenuChange}
                    className="block w-full rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 px-4 py-2.5 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors duration-200"
                />
                <input
                    type="text"
                    name="auth"
                    placeholder="권한"
                    value={newMenu.auth}
                    onChange={handleNewMenuChange}
                    className="block w-full rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 px-4 py-2.5 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors duration-200"
                />
                <button
                    onClick={handleAddMenu}
                    className="w-full inline-flex justify-center items-center px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200"
                >
                    추가하기
                </button>
            </div>
            <AlertDialog/>
            <ConfirmDialog/>
        </div>
    );
};

export default MenuInsert;
