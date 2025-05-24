import React, { useState, useMemo } from 'react';

const UseMemoPage = () => {
    const [count, setCount] = useState(0); // 상태: 숫자 카운트
    const [text, setText] = useState(''); // 상태: 텍스트 입력

    // 숫자가 커질수록 복잡한 연산을 가정
    const expensiveCalculation = (num) => {
        console.log("Expensive calculation in progress...");
        let result = 0;
        for (let i = 0; i < 1000000000; i++) {
            result += num;
        }
        return result;
    };

    console.log('useState 값 변하면 항상 Render!!!')
    // useMemo로 메모이제이션: count가 변경될 때만 연산
    // text 를변경하더라도 다시 계산하지 않아서 용이함
    const calculatedValue = useMemo(() => expensiveCalculation(count), [count]);

    return (
        <>
            <h1 className="text-xl font-bold mb-4">useMemo 예제</h1>
            <p className="mt-4 text-lg">
                <strong>useMemo</strong>는 계산량이 많은 작업이나 렌더링 최적화가 필요할 때,
                이전 값을 메모이제이션하여 불필요한 재계산을 방지하는 Hook입니다.
            </p>

            <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-medium text-gray-800">카운트 증가 (복잡한 계산 적용)</h2>
                <div className="mt-4 space-x-4">
                    <button
                        onClick={() => setCount(count + 1)}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        카운트 증가
                    </button>
                    <button
                        onClick={() => setCount(count - 1)}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                        카운트 감소
                    </button>
                </div>
                <p className="mt-4 text-xl">카운트 값: {count}</p>
                <p className="text-lg mt-2">계산된 값: {calculatedValue}</p>
            </div>

            <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-medium text-gray-800">텍스트 입력</h2>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="텍스트를 입력하세요"
                    className="mt-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-4 text-lg">입력한 텍스트: {text}</p>
            </div>
        </>
    );
};

export default UseMemoPage;
