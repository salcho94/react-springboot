import React, {useRef, useState, forwardRef, useImperativeHandle, useEffect} from "react";
import { useRecoilState } from 'recoil';
import { logState } from '@/recoil/demo/atoms';


// 자식 컴포넌트에서 forwardRef를 사용하여 ref를 전달
const InputWithFocusButton = forwardRef((props, ref) => {
    const inputRef = useRef(null);

    // 부모 컴포넌트에 전달할 메서드를 정의
    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current.focus(); // 입력 필드에 포커스 설정
        },
        clear: () => {
            inputRef.current.value = ""; // 입력 필드 값 비우기
        },
    }));

    return (
        <div className="mb-4">
            <input
                ref={inputRef}
                type="text"
                className="border rounded p-2"
                placeholder="여기에 텍스트를 입력하세요"
            />
        </div>
    );
});

const ForwardRefPage = () => {
    const inputRef = useRef(null); // 자식 컴포넌트로 전달할 ref
    const [count, setCount] = useState(0);
    const [log, setLog] = useRecoilState(logState);

    console.log(count)


    useEffect(() => {
        setLog((prevList) => [...prevList, "컴포넌트가 렌더링되었습니다!"]);
        return () => {
            setLog([]);
            console.log("컴포넌트가 제거될 때 실행됩니다.(경로 이동시)");
        };
    }, [setLog]);

    const focusInput = () => {
        inputRef.current.focus(); // 자식 컴포넌트의 focus 메서드를 호출
    };

    const clearInput = () => {
        inputRef.current.clear(); // 자식 컴포넌트의 clear 메서드를 호출
    };

    return (
        <>
            <ul>
                {log.map((x, index) => {
                    return (<li key={index}>{x}</li>)
                })}
            </ul>
            <h1 className="text-2xl font-bold mb-4">ForwardRef 예제</h1>
            <InputWithFocusButton ref={inputRef}/>

            <div className="mt-4 flex gap-4">
                <button
                    onClick={focusInput}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    입력란 포커스
                </button>
                <button
                    onClick={clearInput}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    입력란 비우기
                </button>
            </div>

            <div className="mt-6 p-4 border rounded bg-white shadow-md">
                <h2 className="text-xl">현재 카운트: {count}</h2>
                <button
                    onClick={() => setCount(count + 1)}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    카운트 증가
                </button>
            </div>
        </>
    );
};

export default ForwardRefPage;
