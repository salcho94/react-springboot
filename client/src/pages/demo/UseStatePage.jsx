import React, { useState } from "react";

const UseStatePage = () => {

    const [count, setCount] = useState(0);
    // 증가 함수
    const increment = () => setCount(count + 1);
    // 감소 함수
    const decrement = () => setCount(count - 1);
    // 초기화 함수
    const reset = () => setCount(0);

    return (
        <>
            <h1 className="text-xl font-bold mb-4">useState 예제 (상태 관리)</h1>
            <div className="flex items-center space-x-4 mb-6">
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    onClick={decrement}
                >
                    감소
                </button>
                <span className="text-xl font-semibold text-gray-800">{count}</span>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    onClick={increment}
                >
                    증가
                </button>
            </div>
            <button
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                onClick={reset}
            >
                초기화
            </button>
        </>
    );
};

export default UseStatePage;
