import {useEffect, useState} from "react";
import { format, subDays, addDays } from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, LabelList, PieChart, Pie, Cell } from "recharts";
import axiosInstance from "@/services/axiosInstance";
import NoRecords from "@/components/healthy/NoRecords";
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 shadow-md rounded text-gray-900">
                <p className="font-bold">{payload[0].name}</p>
                <p>{`${payload[0].value} 세트`}</p>
            </div>
        );
    }
    return null;
};

const HealthStatistics = ({memberId,workoutList,setSelectedDate,selectedDate}) => {
    const [data, setData] = useState([]);


    useEffect(() => {
        axiosInstance.get('/api/health/getStatistics', {
            params: { createdAt: selectedDate, memberId: memberId },
        })
            .then((response) => {
                setData(response.data)
            })
    }, [selectedDate,workoutList]);

    // 날짜 이동 함수
    const handlePrevDay = () => {
        setSelectedDate(format(subDays(new Date(selectedDate), 1), "yyyy-MM-dd"));
    };

    const handleNextDay = () => {
        setSelectedDate(format(addDays(new Date(selectedDate), 1), "yyyy-MM-dd"));
    };
// 전체 목표 세트 합과 실제 수행 세트 합 계산
    const totalGoalSets = data.reduce((sum, item) => sum + item?.goalSets, 0); // 전체 성공값
    const totalActualSets = data.reduce((sum, item) => sum + item?.actualSets, 0); // 전체 기준값

    // 목표 달성률 계산
    const achievementRate = totalGoalSets > 0 ? (totalActualSets / totalGoalSets) * 100 : 0;

    // 원형 그래프 데이터
    const pieData = [
        { name: "달성", value: totalActualSets },
        { name: "미달성", value: totalGoalSets - totalActualSets }
    ];

    // 원형 그래프 색상
    const COLORS = ["blue", "red"]; // 초록색(달성), 빨간색(미달성)

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">운동 기록 조회 </h2>
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
            {data.length > 0 ? (
            <>
                {data.some(item => item.goalSets === item.actualSets) ? (
                    <div className="mt-4 p-4 bg-green-100 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-700">(❁´◡`❁) 목표 달성한 운동 (❁´◡`❁)</h3>
                        <ul className="list-disc pl-5 text-green-700">
                            {data.filter(item => item.goalSets === item.actualSets).map((item, index) => (
                                    <li key={index}>✅ {item.workoutName}</li>
                                ))}
                        </ul>
                    </div>
                ) :
                    (
                        <div className="mt-4 p-4 bg-green-100 rounded-lg">
                            <h3 className="text-lg font-semibold text-green-700">(˚ ˃̣̣̥⌓˂̣̣̥ ) 목표 달성한 운동이 없습니다. (˚ ˃̣̣̥⌓˂̣̣̥ ) </h3>
                        </div>
                    )
                }
                <div className="mt-6 bg-white dark:bg-blue-800 p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-4">목표치 달성률  {achievementRate.toFixed(2)}%</h2>
                    <div className="flex flex-col items-center">
                        <ResponsiveContainer width={500} height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}% `}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <div className="bg-white dark:bg-blue-800 p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-4">운동 종목별 목표 달성률</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="workoutName" tick={{ fill: "black", fontWeight: "bold" }} />
                                <YAxis />
                                <Tooltip contentStyle={{ backgroundColor: "snow", color: "#333", borderRadius: "5px" }} />
                                <Legend />
                                {/* 목표 횟수 - 회색 막대 */}
                                <Bar dataKey="goalSets" fill="blue" name="목표 횟수" />
                                {/* 실제 수행 횟수 - 빨간색 막대 */}
                                <Bar dataKey="actualSets" fill="#e63946" name="실제 수행 횟수"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </>
            ):(
                <NoRecords/>
            )}
        </div>
    );
};

export default HealthStatistics;
