import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();


export const themeState = atom({
    key: "themeState", // 고유 키
    default: "light", // 초기 값 ("light" 또는 "dark")
    effects_UNSTABLE: [persistAtom],
});