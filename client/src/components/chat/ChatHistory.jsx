import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "@/services/axiosInstance";
import { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
registerLocale("ko", ko);

const ChatHistory = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedNickName, setSelectedNickName] = useState("");
    const [chatRecords, setChatRecords] = useState("");
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        if (!selectedDate) return;

        const formattedDate = formatDate(selectedDate);

        axiosInstance.get('/api/chat/users', {
            params: { date: formattedDate }
        })
            .then(res => {
                setUserList(res.data); // 닉네임 배열
            })
            .catch(() => {
                alert("사용자 목록을 불러오는 중 오류가 발생했습니다.");
            });
    }, [selectedDate]);


    const formatDate = (date) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getChatHistory = () => {
        if (!selectedNickName || !selectedDate) {
            alert("날짜와 닉네임을 선택해주세요.");
            return;
        }

        axiosInstance.get('/api/chat/txtHistory', {
            params: {
                nickName: selectedNickName,
                date: formatDate(selectedDate),
            },
        }).then(res => {
            setChatRecords(res.data);
        }).catch(() => {
            setChatRecords("채팅 기록을 불러오는 중 오류가 발생했습니다.");
        });
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">채팅 기록 조회</h2>

            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                {/* 날짜 선택 */}
                <div className="w-full md:w-1/2">
                    <label className="block text-gray-600 font-medium mb-1">날짜</label>
                    <DatePicker
                        selected={selectedDate}
                        locale="ko"
                        onChange={date => setSelectedDate(date)}
                        dateFormat="yyyy-MM-dd"
                        isClearable
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* 닉네임 선택 (Select Box) */}
                <div className="w-full md:w-1/2">
                    <label className="block text-gray-600 font-medium mb-1">닉네임</label>
                    <select
                        value={selectedNickName}
                        onChange={(e) => setSelectedNickName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        {userList.length > 0 ? userList.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))
                        :
                            <option value="">채팅기록이 존재하지 않습니다.</option>
                        }
                    </select>
                </div>

            </div>

            {/* 조회 버튼 */}
            <button
                onClick={getChatHistory}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
                조회
            </button>

            {/* 채팅 기록 출력 */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg overflow-auto max-h-60">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">채팅 기록</h3>
                <pre className="whitespace-pre-wrap text-gray-800">{chatRecords}</pre>
            </div>
        </div>
    );
};

export default ChatHistory;
