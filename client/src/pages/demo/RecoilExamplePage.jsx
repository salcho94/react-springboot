import React from 'react';
import TextInput from '@/components/demo/TextInput';
import CharacterCount from '@/components/demo/CharacterCount';

const RecoilExamplePage = () => {
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Recoil 예제 페이지(입력하고 홈으로 이동해서 값이 동일한지 확인) 전역상태관리</h1>
            <TextInput/>
            <CharacterCount />
        </div>
    );
};

export default RecoilExamplePage;
