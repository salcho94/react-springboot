import React, { useRef } from 'react';

const UseRefPage = () => {
    // useRef로 값 관리
    const countRef = useRef(0);
    const renderCount = useRef(0);
    const countDisplayRef = useRef(null); // 화면의 값 업데이트용 DOM 참조

    // 컴포넌트가 렌더링될 때마다 renderCount 증가
    renderCount.current += 1;

    const increaseCount = () => {
        countRef.current += 1;
        console.log(`현재 카운트: ${countRef.current}`);

        // 화면의 텍스트를 업데이트
        if (countDisplayRef.current) {
            countDisplayRef.current.textContent = `현재 카운트: ${countRef.current}`;
        }
    };

    return (
        <div style={{fontFamily: "Arial", padding: "20px"}}>
            <h1 className="text-xl font-bold mb-4">useRef 예제 (리렌더링 없이 값 관리)</h1>
            <div className="mt-8">
            <h2 className="text-xl font-semibold">2. 값 저장 (리렌더링 없이 하는 방식)</h2>
                {/* 화면의 값을 업데이트할 DOM 요소 */}
                <p ref={countDisplayRef} className="mt-2">
                    현재 카운트: {countRef.current}
                </p>
                <button
                    onClick={increaseCount}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                    카운트 증가
                </button>
                <p className="mt-4">
                    컴포넌트가 렌더링된 횟수: {renderCount.current}
                </p>
            </div>
        </div>
    );
};

export default UseRefPage;
