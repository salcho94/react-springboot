import React, {useEffect, useState} from "react";
import {ChevronLeft, ChevronRight, Paperclip, PenSquare, Search} from "lucide-react";
import useFetch from "@/hooks/useFetch";
import {useNavigate} from "react-router-dom";
import {useAlert} from "@/hooks/useModal";
import axiosInstance from "@/services/axiosInstance";
import {useRecoilState} from "recoil";
import {themeState} from "@/recoil/theme/atoms";

const BoardList = () => {
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const {showAlert,AlertDialog} = useAlert()
    const [boardId, setBoardId] = useState("");
    const [password, setPassword] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState("title");
    const { data = [], error, loading } = useFetch("/api/board/list", "get");
    const [sortedData, setSortedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const navigate = useNavigate();
    const [theme, setTheme] = useRecoilState(themeState);
    const [isOpen, setIsOpen] = useState(false);
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

    useEffect(() => {
        const filtered = sortedData.filter(item => {
            const searchValue = item[searchCategory]?.toString().toLowerCase();
            return searchValue?.includes(searchTerm.toLowerCase());
        });
        setFilteredData(filtered);
        setPage(1); // Reset to first page when search changes
    }, [searchTerm, searchCategory, sortedData]);

    const getPagedData = () => {
        return filteredData.slice((page - 1) * pageSize, page * pageSize);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= Math.ceil(filteredData.length / pageSize)) {
            setPage(newPage);
        }
    };

    const handleSort = (key) => {
        const newOrder = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
        setSortKey(key);
        setSortOrder(newOrder);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white text-red-500 p-4 rounded-lg shadow-lg">
                    에러 발생: {error.message}
                </div>
            </div>
        );
    }

    const goDetail = (id,passYn) =>{
        if(passYn === 'Y'){
            setBoardId(id);
            setIsOpen(true);
        }else{
            navigate('/boardDetail',{state:{boardId:id}})
        }
    }

    const checkPassword = async () =>{
        if( password ===null || password=== ''){
            showAlert('알림','비밀번호를 입력해주세요');
            return;
        }

        axiosInstance.post("/api/board/checkPass", { boardId: boardId ,password:password})
            .then((res) => {
                if(res.data === 'Y'){
                    navigate('/boardDetail',{state:{boardId:boardId,passYn:'Y'}})
                }else{
                    setPassword("");
                    showAlert("다름","비밀번호가 다릅니다.")
                }
            })
            .catch((error) => {
                showAlert("실패", error.response ? error.response.data : error.message);
            });
    }
    const pagedData = getPagedData();

    return (
        <div className="max-w-[330px] sm:max-w-[none]" >
            <div className="bg-white p-6 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-3xl font-bold text-gray-900">게시판</h2>
                    <button
                        onClick={() => navigate("/boardInsert")}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                        <PenSquare className="w-5 h-5" />
                        글 작성
                    </button>
                </div>

                {/* Search Section */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="검색어를 입력하세요"
                            value={
                            searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={` ${
                                theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
                            } w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            `}
                        />
                    </div>
                    <select
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                        className={` ${
                            theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
                        }block w-full sm:w-40 py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                        <option value="title">제목</option>
                        <option value="nickName">작성자</option>
                    </select>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr className="whitespace-nowrap">
                            {[
                                { label: "글번호", key: "idx" },
                                { label: "제목", key: "title" },
                                { label: "작성자", key: "nickName" },
                                { label: "작성일", key: "regDate" },
                                { label: "첨부", key: "fileYn" },
                                { label: "조회수", key: "counts" },
                            ].map((column) => (
                                <th
                                    key={column.key}
                                    onClick={() => handleSort(column.key)}
                                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        {column.label}
                                        {sortKey === column.key && (
                                            <span className="text-blue-500">
                                                    {sortOrder === "asc" ? "↑" : "↓"}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {pagedData.length > 0 ? (
                            pagedData.map((board) => (
                                <tr
                                    key={board.boardId}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() =>{goDetail(board.boardId,board.passYn)}}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {board.idx}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap  text-sm text-gray-900 font-medium">
                                        {board.title} {board.passYn ==='Y' && '🔒'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {board.nickName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {board.regDate}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {board.fileYn ==='Y' && <Paperclip className="w-4 h-4 text-gray-400" />}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {board.counts}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-8 text-center text-sm text-gray-500 bg-gray-50"
                                >
                                    게시글이 존재하지 않습니다.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Section */}
                <div className="flex justify-center items-center mt-6">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className={`relative inline-flex items-center px-4 py-2 rounded-l-md border text-sm font-medium ${
                                page === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        {Array.from(
                            { length: Math.ceil(filteredData.length / pageSize) },
                            (_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handlePageChange(idx + 1)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                        page === idx + 1
                                            ? "z-10 bg-blue-600 text-white border-blue-600"
                                            : "bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    {idx + 1}
                                </button>
                            )
                        )}
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page * pageSize >= filteredData.length}
                            className={`relative inline-flex items-center px-4 py-2 rounded-r-md border text-sm font-medium ${
                                page * pageSize >= filteredData.length
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </nav>
                </div>
            </div>
            {/* 모달 */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-96 p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">비밀번호 🔒</h2>
                        <div className="space-y-4">
                            {/* 비밀번호 입력 */}
                            <div>
                                <input
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                            </div>
                            {/* 버튼 섹션 */}
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => {setBoardId("");setPassword("");setIsOpen(false)}}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                >
                                    닫기
                                </button>
                                <button
                                    type="button"
                                    onClick={checkPassword}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <AlertDialog/>
        </div>
    );
};

export default BoardList;