import React, { useState } from "react";
import axiosInstance from "@/services/axiosInstance";
import { useRecoilState } from 'recoil';
import { userDataState } from '@/recoil/auth/atoms';

const ConnectPage = () => {
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);
    const [requestInfo, setRequestInfo] = useState(null);
    const userData = useRecoilState(userDataState);


    const fetchDataByKey = async (key, subKey) => {
        try {
            const endpoint = "./data.json";

            const config = {
                method: "GET",
                url: endpoint,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData[0].accessToken}`, // 동적으로 설정되는 Authorization 헤더 실제 DB 통신할떄는 안적어도 자동으로 같이간다
                },
                params: { key, subKey }, // 요청 쿼리 파라미터
            };

            // 요청 정보 저장
            setRequestInfo({
                method: config.method,
                url: config.url,
                headers: config.headers, // Authorization 헤더 포함
                params: config.params,
            });

            const response = await axiosInstance.get(endpoint, { headers: config.headers }); // 요청 보내기
            const data = response.data[key][subKey]; // key와 subKey로 데이터 접근
            setResponseData(data);
            setError(null);
        } catch (err) {
            setError(err.message || "Error fetching data");
            setResponseData(null);
        }
    };

    return (
        <main className="p-6">
            <h2 className="text-xl font-semibold">axios instance 사용해서 DB 호출 예제 (지금은 DB 없음)</h2>
            <div className="mt-4">
                {/* 버튼 */}
                <button
                    onClick={() => fetchDataByKey("posts", "1")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    요청1
                </button>
                <button
                    onClick={() => fetchDataByKey("comments", "2")}
                    className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    요청2
                </button>
            </div>

            {/* 요청 정보 */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold">요청 정보</h3>
                {requestInfo ? (
                    <pre className="mt-2 p-4 bg-gray-100 rounded">
                        {JSON.stringify(requestInfo, null, 2)}
                    </pre>
                ) : (
                    <p className="mt-2 text-gray-500">No request made yet.</p>
                )}
            </div>

            {/* 응답 데이터 */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold">응답 정보</h3>
                {responseData ? (
                    <pre className="mt-2 p-4 bg-gray-100 rounded">
                        {JSON.stringify(responseData, null, 2)}
                    </pre>
                ) : (
                    <p className="mt-2 text-gray-500">No data available</p>
                )}
                {error && <p className="mt-2 text-red-500">{error}</p>}
            </div>
        </main>
    );
};

export default ConnectPage;
