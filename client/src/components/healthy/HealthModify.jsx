import React, { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { useAlert, useConfirm } from "@/hooks/useModal";
import axiosInstance from "@/services/axiosInstance";
import NoRecords from "@/components/healthy/NoRecords";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/solid";

const HealthModify = ({ data }) => {
    const [page, setPage] = useState(1);
    const [pageSize] = useState(7);
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [sortedData, setSortedData] = useState([]);
    const { showAlert, AlertDialog } = useAlert();
    const { showConfirm, ConfirmDialog } = useConfirm();

    const sortData = (key, order, dataToSort) => {
        return [...dataToSort].sort((a, b) => {
            if (a[key] < b[key]) return order === "asc" ? -1 : 1;
            if (a[key] > b[key]) return order === "asc" ? 1 : -1;
            return 0;
        });
    };

    useEffect(() => {
        if (data && Array.isArray(data)) {
            let updatedData = data;
            if (sortKey) {
                updatedData = sortData(sortKey, sortOrder, data);
            }
            setSortedData(updatedData);
        }
    }, [data, sortKey, sortOrder]);

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
                item.healthId === id ? { ...item, [key]: e.target.value } : item
            )
        );
    };

    const handleUpdate = async (healthId,workoutName,repsCount,originalSetsCount) => {
        if (await showConfirm("수정", "해당 운동을 수정하시겠습니까?")) {
            axiosInstance.post("/api/health/updateHealth", {
                healthId: healthId,
                workoutName: workoutName,
                repsCount: repsCount,
                setsCount: originalSetsCount,
            })
                .then((res) => {
                    showAlert("수정 성공", res.data);
                })
                .catch((error) => {
                    showAlert("수정 실패", error.response ? error.response.data : error.message);
                });
        }
    };


    const pagedData = getPagedData();

    return (
        <div>
            <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">운동 관리</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-300">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-100">
                    <tr>
                        {["운동명", "세트당 목표 횟수", "목표 세트 횟수"].map((label, index) => {
                            const key = ["workoutName", "repsCount", "originalSetsCount"][index];
                            return (
                                <th key={key} className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase cursor-pointer" onClick={() => handleSort(key)}>
                                    <div className="flex items-center">
                                        {label}
                                        {sortKey === key && (
                                            sortOrder === "asc" ? " ▲" : " ▼"
                                        )}
                                    </div>
                                </th>
                            );
                        })}
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">수정</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {pagedData.length > 0 ? (
                        pagedData.map((health) => (
                            <tr key={health?.healthId} className="hover:bg-gray-50">
                                {["workoutName", "repsCount", "originalSetsCount"].map((key) => (
                                    <td key={key} className="px-6 py-4 text-sm text-gray-900">
                                        <input type="text" value={health[key]} onChange={(e) => handleInputChange(health.healthId, e, key)}
                                               className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full" />
                                    </td>
                                ))}
                                <td className="px-6 py-4 text-sm">
                                    <button className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                                            onClick={() => handleUpdate(health.healthId, health.workoutName, health.repsCount, health.originalSetsCount)}>
                                        수정
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                <NoRecords />
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center items-center mt-6 space-x-2">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}
                        className={`px-4 py-2 border rounded-md ${page === 1 ? "bg-gray-200 text-gray-500" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                    이전
                </button>
                {Array.from({ length: Math.ceil((sortedData?.length || 0) / pageSize) }, (_, idx) => (
                    <button key={idx} onClick={() => handlePageChange(idx + 1)}
                            className={`px-4 py-2 border rounded-md ${page === idx + 1 ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                        {idx + 1}
                    </button>
                ))}
                <button onClick={() => handlePageChange(page + 1)} disabled={page * pageSize >= (sortedData?.length || 0)}
                        className={`px-4 py-2 border rounded-md ${page * pageSize >= (sortedData?.length || 0) ? "bg-gray-200 text-gray-500" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                    다음
                </button>
            </div>
            <ConfirmDialog />
            <AlertDialog />
        </div>
    );
};

export default HealthModify;
