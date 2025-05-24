import { selector } from 'recoil';
import { textState } from '@/recoil/demo/atoms';

export const charCountState = selector({
    key: 'charCountState', // 고유한 키
    get: ({ get }) => {
        const text = get(textState); // `textState` 값을 가져옴
        return text.length; // 문자열 길이 반환
    },
});
