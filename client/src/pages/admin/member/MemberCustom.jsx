import React, { useEffect, useState } from "react";
import { useAlert, useConfirm } from "@/hooks/useModal";
import axiosInstance from "@/services/axiosInstance";
import useFetch from "@/hooks/useFetch";

const MemberCustom = () => {
    const [page, setPage] = useState(1);
    const [pageSize] = useState(7);
    const [sortKey, setSortKey] = useState(null); // 정렬 기준
    const [sortOrder, setSortOrder] = useState("asc"); // 정렬 방향 (asc 또는 desc)
    const { data = [], error, loading } = useFetch("/api/member/getMemberList", "get");
    const [sortedData, setSortedData] = useState([]); // 정렬된 데이터
    const { showAlert, AlertDialog } = useAlert();
    const { showConfirm, ConfirmDialog } = useConfirm();

    // 데이터 정렬 함수
    const sortData = (key, order, dataToSort) => {
        const sorted = [...dataToSort].sort((a, b) => {
            if (a[key] < b[key]) return order === "asc" ? -1 : 1;
            if (a[key] > b[key]) return order === "asc" ? 1 : -1;
            return 0;
        });
        return sorted;
    };

    // 전체 데이터를 기준으로 정렬
    useEffect(() => {
        if (data && Array.isArray(data)) {
            let updatedData = data;
            if (sortKey) {
                updatedData = sortData(sortKey, sortOrder, data);
            }
            setSortedData(updatedData);
        }
    }, [data, sortKey, sortOrder]);

    // 페이지 변경 시 데이터를 가져옴
    const getPagedData = () => {
        return sortedData.slice((page - 1) * pageSize, page * pageSize);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= Math.ceil((sortedData?.length || 0) / pageSize)) {
            setPage(newPage);
        }
    };

    const handleSort = (key) => {
        const newOrder = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
        setSortKey(key);
        setSortOrder(newOrder);
    };

    const handleInputChange = (id, e, key) => {
        setSortedData((prevData) =>
            prevData.map((item) =>
                item.memberId === id ? { ...item, [key]: e.target.value } : item
            )
        );
    };

    const handleDelete = async (id) => {
        if (await showConfirm("사용자 삭제", "해당 사용자를 제거하시겠습니까?")) {
            axiosInstance.post("/api/member/memberDelete", { memberId: id })
                .then((res) => {
                    fetchMemberData();
                    showAlert("제거 성공", res.data);
                })
                .catch((error) => {
                    showAlert("제거 실패", error.response ? error.response.data : error.message);
                });
        }
    };

    const handleUpdate = async (id, auth) => {
        if (await showConfirm("권한 수정", "해당 사용자의 권한을 수정하시겠습니까?")) {
            axiosInstance.post("/api/member/authUpdate", {
                memberId: id,
                auth: auth,
            })
                .then((res) => {
                    fetchMemberData();
                    showAlert("수정 성공", res.data);
                })
                .catch((error) => {
                    showAlert("수정 실패", error.response ? error.response.data : error.message);
                });
        }
    };

    const fetchMemberData = async () => {
        try {
            const response = await axiosInstance.get('/api/member/getMemberList');
            setSortedData(response.data);
        } catch (error) {
            showAlert('데이터 로드 실패', error.response ? error.response.data : error.message);
        }
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

    const pagedData = getPagedData();

    return (
        <div className="max-w-[330px] sm:max-w-[none]">
            <h2 className="text-2xl font-bold mb-6 ">사용자 관리</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200 ">
                <table className="min-w-full divide-y divide-gray-200 ">
                    <thead className="bg-gray-50">
                    <tr className="whitespace-nowrap">
                        {[
                            { label: "고유 id", key: "memberId" },
                            { label: "email", key: "email" },
                            { label: "nickname", key: "nickName" },
                            { label: "가입경로", key: "type" },
                            { label: "가입일", key: "regDate" },
                            { label: "수정일", key: "uptDate" },
                            { label: "권한", key: "auth" },
                        ].map((column) => (
                            <th
                                key={column.key}
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort(column.key)}
                            >
                                {column.label}
                                {sortKey === column.key &&
                                    (sortOrder === "asc" ? " ▲" : " ▼")}
                            </th>
                        ))}
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {pagedData.length > 0 ? (
                        pagedData.map((member) => (
                            <tr key={member.memberId} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {member.memberId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {member.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {member.nickName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {member.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {member.regDate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {member.uptDate}
                                </td>
                                <td className="whitespace-nowrap text-sm text-gray-900">
                                    <input
                                        type="text"
                                        value={member.auth}
                                        onChange={(e) => handleInputChange(member.memberId, e, "auth")}
                                        className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full max-w-[200px]"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button type="button"
                                        className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900"
                                        onClick={() => handleUpdate(member.memberId, member.auth)}
                                    >
                                        수정
                                    </button>
                                    <button type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                                        onClick={() => handleDelete(member.memberId)}
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                사용자가 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center items-center mt-6">
                <ul className="inline-flex items-center gap-2">
                    <li>
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className={`px-4 py-2 border rounded-md text-sm font-medium ${
                                page === 1
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            이전
                        </button>
                    </li>
                    {Array.from(
                        { length: Math.ceil((sortedData?.length || 0) / pageSize) },
                        (_, idx) => (
                            <li key={idx}>
                                <button
                                    onClick={() => handlePageChange(idx + 1)}
                                    className={`px-4 py-2 border rounded-md text-sm font-medium ${
                                        page === idx + 1
                                            ? "bg-blue-500 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    {idx + 1}
                                </button>
                            </li>
                        )
                    )}
                    <li>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page * pageSize >= (sortedData?.length || 0)}
                            className={`px-4 py-2 border rounded-md text-sm font-medium ${
                                page * pageSize >= (sortedData?.length || 0)
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            다음
                        </button>
                    </li>
                </ul>
            </div>
            <ConfirmDialog />
            <AlertDialog />
        </div>
    );
};

export default MemberCustom;
