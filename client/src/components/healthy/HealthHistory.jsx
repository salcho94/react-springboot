import { useState, useEffect } from "react";
import { format, subDays, addDays } from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axiosInstance from "@/services/axiosInstance";
import NoRecords from "@/components/healthy/NoRecords";

const HealthHistory = ({ memberId ,workoutList,setSelectedDate,selectedDate}) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 날짜 변경 시 데이터 요청
    useEffect(() => {
        setLoading(true);
        setError(null);
        axiosInstance.get('/api/health/getHistory', {
            params: { createdAt: selectedDate, memberId: memberId },
        })
            .then((response) => {
                setHistory(response.data);
            })
            .catch(() => {
                setError("데이터를 불러오는 중 오류가 발생했습니다.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedDate,workoutList]);

    // 날짜 이동 함수
    const handlePrevDay = () => {
        setSelectedDate(format(subDays(new Date(selectedDate), 1), "yyyy-MM-dd"));
    };

    const handleNextDay = () => {
        setSelectedDate(format(addDays(new Date(selectedDate), 1), "yyyy-MM-dd"));
    };

    // 운동별 첫 번째 기록 찾기
    const sortedHistory = [...history].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));


    // 첫 번째 기록 찾기
    const firstRecords = {};
    sortedHistory.forEach((item, index) => {
        const workoutName = item.workoutName.trim().toLowerCase();

        if (firstRecords[workoutName] === undefined) { // falsy 값 문제 해결
            console.log(`✅ 첫 기록 추가: ${workoutName}, 인덱스 ${index}`);
            firstRecords[workoutName] = index;
        }
    });

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">운동 기록 조회 </h2>
            <h6 className="text-md font-bold text-gray-900 dark:text-white mb-4 text-center">첫 세트 기록<span className="text-blue-700">(파란색)</span> & 완료<span className="text-red-700">(빨간색)</span></h6>

            {/* 날짜 선택 및 네비게이션 */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <button onClick={handlePrevDay} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                    <FaChevronLeft className="text-gray-700 dark:text-white" />
                </button>

                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                />

                <button onClick={handleNextDay} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                    <FaChevronRight className="text-gray-700 dark:text-white" />
                </button>
            </div>

            {/* 운동 기록 테이블 */}
            <div className="overflow-x-auto">
                {loading ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">로딩 중...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <table className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
                        <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                            <th className="py-2 px-4 border-b">시간</th>
                            <th className="py-2 px-4 border-b">운동</th>
                            <th className="py-2 px-4 border-b">세트</th>
                            <th className="py-2 px-4 border-b">남은세트</th>
                            <th className="py-2 px-4 border-b">완료여부</th>
                        </tr>
                        </thead>
                        <tbody>
                        {history.length > 0 ? (
                            history.map((item, index) => (
                                <tr key={index} className="text-gray-800 dark:text-gray-200 text-center">
                                    {/* 첫 번째 기록(파란색) & 완료(빨간색) */}
                                    <td className={`py-2 px-4 border-b 
                                        ${firstRecords[item.workoutName] === index ? "text-blue-700 font-bold" : ""} 
                                        ${item.status === '완료' ? "text-red-700 font-bold" : "font-bold"}`}>
                                        {item.createdAt}
                                    </td>
                                    <td className="py-2 px-4 border-b">{item.workoutName}</td>
                                    <td className="py-2 px-4 border-b">{item.setsCount}</td>
                                    <td className="py-2 px-4 border-b">{item.repsCount}</td>
                                    <td className={`py-2 px-4 border-b 
                                            ${firstRecords[item.workoutName] === index && item.status !== '완료' ? "text-blue-700 font-bold" : ""} 
                                            ${item.status === '완료' ? "text-red-700 font-bold" : "font-bold"}`}>
                                        {item.status}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-4 text-center text-gray-500 dark:text-gray-400">
                                   <NoRecords/>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default HealthHistory;
