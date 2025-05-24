import { atom } from 'recoil';

// Atom: 상태 정의
export const textState = atom({
    key: 'textState', // 고유한 키
    default: '', // 초기 값
});

export const logState = atom({
    key: "logState", // 고유 key
    default: [], // 초기값: 빈 배열
});