import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useFetch from "@/hooks/useFetch";
import { useAlert,useConfirm } from "@/hooks/useModal";
import axiosInstance from "@/services/axiosInstance";
import MenuInsert from "@/pages/admin/menu/MenuInsert";


const MenuCustom = () => {
    const { data = [], error, loading } = useFetch("/api/menu/getMenuList", "get", { auth: "all" });
    const [menuData, setMenuData] = useState([]);
    const { showAlert, AlertDialog } = useAlert();
    const { showConfirm, ConfirmDialog } = useConfirm();
    const fetchMenuData = async () => {
        try {
            const response = await axiosInstance.get('/api/menu/getMenuList', {
                params: { auth: 'all' }
            });
            setMenuData(response.data); 
        } catch (error) {
            await showAlert('데이터 로드 실패', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setMenuData(data);
        }
    }, [data]);
    const handleInputChange = (id, e, key) => {
        setMenuData((prevMenu) =>
            prevMenu.map((item) =>
                item.id === id ? { ...item, [key]: e.target.value } : item
            )
        );
    };

    const handleDelete = async (id) => {
        if (await showConfirm('메뉴 삭제', '해당 메뉴를 삭제 할까요?')) {
            axiosInstance.post('/api/menu/menuDelete', {
                id: id
            })
            .then(res => {
                fetchMenuData(); // 새로 고침 함수 호출
                showAlert('삭제 성공', res.data);
            })
            .catch(error => {
                showAlert('삭제 실패', error.response ? error.response.data : error.message);
            });
        }
    };

    const handleUpdate = async (id, name, path, auth) => {
        if (await showConfirm('메뉴 수정', '해당 메뉴를 수정 할까요?')) {
            axiosInstance.post('/api/menu/menuUpdate', {
                id: id,
                name: name,
                path: path,
                auth: auth
            })
                .then(res => {
                    showAlert('수정 성공', res.data);
                })
                .catch(error => {
                    showAlert('수정 실패', error.response ? error.response.data : error.message);
                });
        }
    };




    const onDragEnd = (result) => {
        if (!result.destination) return;

        // 메뉴 순서 변경
        const reorderedData = Array.from(menuData);
        const [removed] = reorderedData.splice(result.source.index, 1);
        reorderedData.splice(result.destination.index, 0, removed);

        // 각 항목의 sort 
        const updatedData = reorderedData.map((menu, index) => ({
            ...menu,
            sort: index + 1,
        }));
        console.log(updatedData)
        axiosInstance.post('/api/menu/sortUpdate',updatedData).then(() =>{
            setMenuData(updatedData);
        })
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-900 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white text-red-500 p-4 rounded-lg shadow-sm">
                    에러 발생: {error.message}
                </div>
            </div>
        );
    }

    return (

        <div className="max-w-[330px] sm:max-w-[none]">
            <h3>(Drag 메뉴 순서 조정)</h3>
            <h2 className="text-2xl font-bold mb-6 ">메뉴 관리</h2>
                    <MenuInsert fetchMenuData={fetchMenuData} />
                    <div className="p-6">
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="menu">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="overflow-x-auto"
                                    >
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                            <tr className="whitespace-nowrap">
                                                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">sort</th>
                                                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">name</th>
                                                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">path</th>
                                                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">auth</th>
                                                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">actions</th>
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-100">
                                            {menuData.map((menu, index) => (
                                                <Draggable
                                                    key={menu.id}
                                                    draggableId={menu.id.toString()}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <tr
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="hover:bg-gray-50/80 transition-colors duration-150"
                                                        >
                                                            <td className="whitespace-nowrap">
                                                                {index + 1}
                                                            </td>
                                                            <td className="whitespace-nowrap">
                                                                <input
                                                                    type="text"
                                                                    value={menu.name}
                                                                    onChange={(e) => handleInputChange(menu.id, e, "name")}
                                                                    className="block w-full rounded-md bg-white border border-gray-200 text-gray-700 px-3 py-2 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors duration-200"
                                                                />
                                                            </td>
                                                            <td className="whitespace-nowrap">
                                                                <input
                                                                    type="text"
                                                                    value={menu.path}
                                                                    onChange={(e) => handleInputChange(menu.id, e, "path")}
                                                                    className="block w-full rounded-md bg-white border border-gray-200 text-gray-700 px-3 py-2 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors duration-200"
                                                                />
                                                            </td>
                                                            <td className="whitespace-nowrap">
                                                                <input
                                                                    type="text"
                                                                    value={menu.auth}
                                                                    onChange={(e) => handleInputChange(menu.id, e, "auth")}
                                                                    className="block w-full rounded-md bg-white border border-gray-200 text-gray-700 px-3 py-2 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors duration-200"
                                                                />
                                                            </td>
                                                            <td className="px-2 py-1 whitespace-nowrap text-sm">
                                                                <div className="pt-2 flex items-center space-x-4">
                                                                    <button type="button" className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900"
                                                                            onClick={() => handleUpdate(menu.id, menu.name, menu.path, menu.auth)}
                                                                    >
                                                                        수정
                                                                    </button>
                                                                    <button type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                                                                            onClick={() => handleDelete(menu.id)}
                                                                    >
                                                                        삭제
                                                                    </button>
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-5 w-5 text-gray-400 cursor-move"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M4 6h16M4 12h16m-7 6h7"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                    <AlertDialog />
                    <ConfirmDialog/>
                </div>
    );
};

export default MenuCustom;