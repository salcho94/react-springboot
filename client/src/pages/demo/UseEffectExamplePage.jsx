import React, { useState, useEffect } from 'react';
import axiosInstance from "@/services/axiosInstance";




const UseEffectExamplePage = () => {
    // 상태 정의
    const [count, setCount] = useState(0); // 카운트를 위한 상태
    const [data, setData] = useState(null); // API에서 가져온 데이터를 저장할 상태


    // 1. 컴포넌트가 처음 렌더링될 때 실행되는 useEffect
    useEffect(() => {
        console.log( "컴포넌트가 처음 렌더링되었습니다!")
        // 컴포넌트가 제거될 때 실행되는 정리 함수
        return () => {
            console.log( "컴포넌트가 제거될 때 실행됩니다.(경로 이동시)")
        };
    }, []); // 빈 배열은 컴포넌트가 처음 렌더링될 때만 실행

    // 2. 특정 상태(count)가 변경될 때마다 실행되는 useEffect
    useEffect(() => {
        console.log("카운트가 변경되었습니다")
    }, [count]); // count가 변경될 때마다 실행

    // 3. 비동기적으로 데이터 가져오기 (최초 한 번만 API 호출)
    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosInstance.get('./data.json');
            console.log("데이터가 처음 렌더링되었습니다!")
            const json = await response.data.useEffect;
            setData(json); // API에서 받아온 데이터 상태 업데이트
        };

        fetchData();
    }, []); // 빈 배열은 컴포넌트가 처음 렌더링될 때만 실행

    return (
        <>
            <h1 className="text-xl font-bold mb-4">useEffect 예제</h1>
            {/* 1. 카운트 상태 변경 */}
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mb-6">
                <h2 className="text-2xl text-gray-800 mb-2">카운트: {count}</h2>
                <button
                    onClick={() => setCount(count + 1)} // 카운트를 1 증가시킴
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    카운트 증가
                </button>
            </div>

            {/* 2. API에서 가져온 데이터 표시 */}
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl text-gray-800 mb-4">최초 한번 API에서 가져온 데이터(카운트 증가할때는 호출안함)</h2>
                {data ? (
                    <div>
                        <h3 className="text-xl text-blue-500 mb-2">{data.title}</h3>
                        <p className="text-gray-700">{data.body}</p>
                    </div>
                ) : (
                    <p className="text-gray-500">데이터를 가져오는 중...</p>
                )}
            </div>
        </>
    );
};

export default UseEffectExamplePage;
