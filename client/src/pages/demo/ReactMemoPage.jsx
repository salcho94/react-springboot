import React, { useState, useCallback,memo } from "react";

// React.memo로 최적화된 자식 컴포넌트
const ChildComponent = memo(({ count, onButtonClick }) => {
    console.log("ChildComponent 렌더링 count 변경");
    return (
        <div className="p-4 border rounded bg-gray-100 shadow">
            <h2 className="text-lg font-bold">Child Component</h2>
            <p>Count from Parent: {count}</p>
            <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={onButtonClick}
            >
                Increase Count
            </button>
        </div>
    );
});

// 부모 컴포넌트
const ReactMemoPage = () => {
    const [count, setCount] = useState(0);
    const [text, setText] = useState("");

    // useCallback으로 콜백 메모화
    const increaseCount = useCallback(() => {
        setCount((prevCount) => prevCount + 1);
    }, []);

    console.log("ReactMemoExample 렌더링 text변경");

    return (
        <>
            <h1 className="text-xl font-bold mb-4">React.memo 예제 페이지</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type something..."
                    className="px-4 py-2 border rounded shadow"
                />
            </div>
            <ChildComponent count={count} onButtonClick={increaseCount}/>
        </>
    );
};

export default ReactMemoPage;
