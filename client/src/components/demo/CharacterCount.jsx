import React from 'react';
import { useRecoilValue } from 'recoil';
import { charCountState } from '@/recoil/demo/selectors';

const CharacterCount = () => {
    const count = useRecoilValue(charCountState);

    return <div className="mt-2 text-blue-500">문자 수: {count}</div>;
};

export default CharacterCount;
