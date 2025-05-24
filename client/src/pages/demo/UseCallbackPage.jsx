import React, { useState, useCallback,memo } from 'react';

// 자식 컴포넌트
const ChildComponent = memo(({ onClick, label }) => {
    console.log(`자식 컴포넌트  - ${label}`);
    return (
        <button
            onClick={onClick}
            className="px-4 py-2 m-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none"
        >
            {label}
        </button>
    );
});

const UseCallbackPage = () => {
    console.log('부모 컴포넌트')
    const [count, setCount] = useState(0);
    const [text, setText] = useState('');

    // useCallback으로 함수 메모이제이션
    const increment = useCallback(() => {
        setCount((prevCount) => prevCount + 1);
    }, []);

    const decrement = useCallback(() => {
        setCount((prevCount) => prevCount - 1);
    }, []);

    // 메모이제이션 없이 일반 함수
    const handleInputChange = (e) => {
        setText(e.target.value);
    };

    return (
        <>
            <h1 className="text-xl font-bold mb-4">useCallback 예제</h1>
            <p className="mt-4 text-lg text-gray-700 text-center">
                <strong>useCallback</strong>은 컴포넌트가 리렌더링될 때 동일한 함수 참조를 유지하여
                불필요한 함수 재생성을 방지합니다.
            </p>

            <div className="mt-8 text-center">
                <h2 className="text-xl font-medium text-gray-800">카운터</h2>
                <p className="mt-2 text-2xl text-gray-800">현재 카운트: {count}</p>
                <div className="mt-4 flex justify-center space-x-4">
                    <ChildComponent onClick={increment} label="카운트 증가"/>
                    <ChildComponent onClick={decrement} label="카운트 감소"/>
                </div>
            </div>

            <div className="mt-8 text-center">
                <h2 className="text-xl font-medium text-gray-800">텍스트 입력</h2>
                <input
                    type="text"
                    value={text}
                    onChange={handleInputChange}
                    placeholder="텍스트를 입력하세요"
                    className="mt-4 p-3 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-2 text-lg text-gray-700">입력한 텍스트: {text}</p>
            </div>
        </>
    );
};

export default UseCallbackPage;
