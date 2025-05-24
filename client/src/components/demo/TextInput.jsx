import React from 'react';
import { useRecoilState } from 'recoil';
import { textState } from '@/recoil/demo/atoms';

const TextInput = () => {
    const [text, setText] = useRecoilState(textState);

    const handleChange = (e) => {
        setText(e.target.value);
    };

    return (
        <div>
            <input
                type="text"
                value={text}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                placeholder="텍스트를 입력하세요"
            />
            <div className="mt-2 text-gray-700">입력한 값: {text}</div>
        </div>
    );
};

export default TextInput;
